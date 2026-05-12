/**
 * Searchcraft Analytics — state machine helpers, metric cards, and chart.
 *
 * IMPORTANT: innerHTML is BANNED in this file.
 * All user-visible string values must go through setText() which sets
 * textContent only. This contract prevents XSS.
 *
 * @package Searchcraft
 * @since   1.5.0
 */

/* global ajaxurl, scAnalytics, Chart */
( function () {
	'use strict';

	/**
	 * Set data-state on an element.
	 * Valid states: 'loading' | 'ready' | 'empty' | 'error'
	 *
	 * @param {Element} el
	 * @param {string}  state
	 */
	function setState( el, state ) {
		if ( el ) {
			el.setAttribute( 'data-state', state );
		}
	}

	/**
	 * Safely write text to a node via textContent. Never uses innerHTML.
	 *
	 * @param {Element} node
	 * @param {string}  value
	 */
	function setText( node, value ) {
		if ( node ) {
			node.textContent = value;
		}
	}

	/**
	 * Render a WP-style admin notice into the page.
	 *
	 * @param {string}  type           'success' | 'error' | 'warning' | 'info'
	 * @param {string}  message        Plain-text message (set via textContent).
	 * @param {Object}  [opts]
	 * @param {boolean} [opts.dismissible=true]
	 * @param {number}  [opts.autoDismissMs]
	 * @returns {Element}
	 */
	function renderNotice( type, message, opts ) {
		const options       = opts || {};
		const dismissible   = options.dismissible !== false;
		const autoDismissMs = options.autoDismissMs || null;

		const wrap      = document.createElement( 'div' );
		wrap.className  = 'notice notice-' + type + ( dismissible ? ' is-dismissible' : '' );
		wrap.setAttribute( 'aria-live', 'polite' );
		if ( ! dismissible ) {
			wrap.setAttribute( 'role', 'alert' );
		}

		const p = document.createElement( 'p' );
		setText( p, message );
		wrap.appendChild( p );

		if ( dismissible ) {
			const btn  = document.createElement( 'button' );
			btn.type   = 'button';
			btn.className = 'notice-dismiss';
			const sr   = document.createElement( 'span' );
			sr.className = 'screen-reader-text';
			setText( sr, 'Dismiss this notice.' );
			btn.appendChild( sr );
			btn.addEventListener( 'click', function () {
				if ( wrap.parentNode ) {
					wrap.parentNode.removeChild( wrap );
				}
			} );
			wrap.appendChild( btn );
		}

		const target = document.querySelector( '.wrap' ) || document.body;
		target.insertBefore( wrap, target.firstChild );

		if ( autoDismissMs ) {
			setTimeout( function () {
				if ( wrap.parentNode ) {
					wrap.parentNode.removeChild( wrap );
				}
			}, autoDismissMs );
		}

		return wrap;
	}

	function fetchAnalyticsSum() {
		if ( typeof scAnalytics === 'undefined' ) {
			return;
		}

		const dauCard = document.getElementById( 'sc-metric-card-dau' );
		const mauCard = document.getElementById( 'sc-metric-card-mau' );

		if ( ! dauCard && ! mauCard ) {
			return;
		}

		const xhr = new XMLHttpRequest();
		xhr.open( 'POST', ajaxurl, true );
		xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

		xhr.onload = function () {
			if ( xhr.status !== 200 ) {
				setSumCardsError( dauCard, mauCard );
				return;
			}
			let resp;
			try {
				resp = JSON.parse( xhr.responseText );
			} catch ( e ) {
				setSumCardsError( dauCard, mauCard );
				return;
			}
			if ( ! resp.success || ! resp.data ) {
				setSumCardsError( dauCard, mauCard );
				return;
			}
			const data = resp.data;
			if ( dauCard ) {
				applyMetricValue( dauCard, parseInt( data.daily_active_users, 10 ) );
			}
			if ( mauCard ) {
				applyMetricValue( mauCard, parseInt( data.monthly_active_users, 10 ) );
			}
			renderPopularTerms( data.popular_terms || [] );
		};

		xhr.onerror = function () {
			setSumCardsError( dauCard, mauCard );
		};

		const params =
			'action=searchcraft_analytics_sum' +
			'&nonce=' + encodeURIComponent( scAnalytics.nonce ) +
			'&range=' + encodeURIComponent( scAnalytics.defaultRange );

		xhr.send( params );
	}

	function applyMetricValue( cardEl, value ) {
		const valueText = cardEl.querySelector( '.sc-metric-value-text' );
		if ( isNaN( value ) || value === 0 ) {
			setText( valueText, '—' ); // em dash
			setState( cardEl, 'empty' );
		} else {
			setText( valueText, value.toLocaleString() );
			setState( cardEl, 'ready' );
		}
	}

	function setSumCardsError( dauCard, mauCard ) {
		const msg = 'Could not load analytics data.';
		if ( dauCard ) {
			setText( dauCard.querySelector( '.sc-metric-error-text' ), msg );
			setState( dauCard, 'error' );
		}
		if ( mauCard ) {
			setText( mauCard.querySelector( '.sc-metric-error-text' ), msg );
			setState( mauCard, 'error' );
		}
		setPopularTermsError();
	}

	function renderPopularTerms( terms ) {
		const wrapper = document.getElementById( 'sc-popular-terms-wrapper' );
		if ( ! wrapper ) {
			return;
		}
		if ( ! Array.isArray( terms ) || 0 === terms.length ) {
			setState( wrapper, 'empty' );
			return;
		}
		const tbody = document.getElementById( 'sc-popular-terms-tbody' );
		if ( tbody ) {
			while ( tbody.firstChild ) {
				tbody.removeChild( tbody.firstChild );
			}
			terms.forEach( function ( item ) {
				const tr      = document.createElement( 'tr' );
				const tdTerm  = document.createElement( 'td' );
				const tdCount = document.createElement( 'td' );
				tdTerm.setAttribute( 'data-colname', 'Search Term' );
				tdCount.setAttribute( 'data-colname', 'Count' );
				setText( tdTerm, item.term || '' );
				setText( tdCount, ( item.count || 0 ).toLocaleString() );
				tr.appendChild( tdTerm );
				tr.appendChild( tdCount );
				tbody.appendChild( tr );
			} );
		}
		setState( wrapper, 'ready' );
	}

	function setPopularTermsError() {
		const wrapper = document.getElementById( 'sc-popular-terms-wrapper' );
		if ( ! wrapper ) {
			return;
		}
		setText( wrapper.querySelector( '.sc-popular-terms-error-text' ), 'Could not load popular search terms.' );
		setState( wrapper, 'error' );
	}

	let scChart        = null;
	let scCurrentRange = 'defaultRange' in ( window.scAnalytics || {} )
		? scAnalytics.defaultRange
		: '1w';
	let scChartInflight = false;

	function initSearchVolumeChart() {
		const chartWrapper = document.getElementById( 'sc-chart-wrapper' );
		if ( ! chartWrapper || typeof Chart === 'undefined' ) {
			return;
		}

		fetchChartData( scCurrentRange, true );

		const tabList = document.querySelector( '.sc-range-tabs' );
		if ( tabList ) {
			tabList.addEventListener( 'click', function ( e ) {
				const tab = e.target.closest( '.sc-range-tab' );
				if ( ! tab || scChartInflight ) {
					return;
				}
				const range = tab.getAttribute( 'data-range' );
				if ( range === scCurrentRange ) {
					return;
				}

				tabList.querySelectorAll( '.sc-range-tab' ).forEach( function ( t ) {
					t.setAttribute( 'aria-selected', 'false' );
					t.classList.remove( 'sc-range-tab-active' );
				} );
				tab.setAttribute( 'aria-selected', 'true' );
				tab.classList.add( 'sc-range-tab-active' );

				scCurrentRange = range;
				fetchChartData( range, false );
			} );
		}

		chartWrapper.addEventListener( 'click', function ( e ) {
			const btn = e.target.closest( '.sc-chart-retry' );
			if ( ! btn ) {
				return;
			}
			e.preventDefault();
			setState( chartWrapper, 'loading' );
			fetchChartData( scCurrentRange, true );
		} );
	}

	function fetchChartData( range, isInitial ) {
		if ( typeof scAnalytics === 'undefined' ) {
			return;
		}

		const chartCard    = document.getElementById( 'sc-chart-card' );
		const chartWrapper = document.getElementById( 'sc-chart-wrapper' );
		const tabList      = document.querySelector( '.sc-range-tabs' );

		if ( ! chartWrapper ) {
			return;
		}

		scChartInflight = true;

		if ( isInitial ) {
			setState( chartWrapper, 'loading' );
		} else {
			if ( chartCard ) {
				chartCard.classList.add( 'is-loading' );
			}
			if ( tabList ) {
				tabList.setAttribute( 'aria-busy', 'true' );
			}
		}

		const xhr = new XMLHttpRequest();
		xhr.open( 'POST', ajaxurl, true );
		xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

		xhr.onload = function () {
			scChartInflight = false;
			clearChartLoadingState( chartCard, tabList );

			if ( xhr.status !== 200 ) {
				setChartError( chartWrapper, isInitial );
				return;
			}
			let resp;
			try {
				resp = JSON.parse( xhr.responseText );
			} catch ( e ) {
				setChartError( chartWrapper, isInitial );
				return;
			}
			if ( ! resp.success || ! resp.data ) {
				setChartError( chartWrapper, isInitial );
				return;
			}
			renderChart( resp.data, isInitial, chartWrapper );
		};

		xhr.onerror = function () {
			scChartInflight = false;
			clearChartLoadingState( chartCard, tabList );
			setChartError( chartWrapper, isInitial );
		};

		const params =
			'action=searchcraft_analytics_chart' +
			'&nonce=' + encodeURIComponent( scAnalytics.nonce ) +
			'&range=' + encodeURIComponent( range );

		xhr.send( params );
	}

	function clearChartLoadingState( chartCard, tabList ) {
		if ( chartCard ) {
			chartCard.classList.remove( 'is-loading' );
		}
		if ( tabList ) {
			tabList.removeAttribute( 'aria-busy' );
		}
	}

	function renderChart( data, isInitial, chartWrapper ) {
		const totalSearches = parseInt( data.total_searches, 10 ) || 0;
		const series        = Array.isArray( data.chart_series ) ? data.chart_series : [];
		const totalEl       = document.getElementById( 'sc-total-searches-value' );
		const totalWrapper  = document.querySelector( '.sc-total-searches' );

		if ( totalEl && totalWrapper ) {
			if ( totalSearches === 0 ) {
				setText( totalEl, '—' );
				setState( totalWrapper, 'empty' );
			} else {
				setText( totalEl, totalSearches.toLocaleString() );
				setState( totalWrapper, 'ready' );
			}
		}

		if ( series.length === 0 ) {
			setState( chartWrapper, 'empty' );
			return;
		}

		const labels = series.map( function ( point ) {
			const ms = parseInt( point[ 0 ], 10 ) * 1000;
			return new Date( ms ).toLocaleDateString( undefined, { month: 'short', day: 'numeric' } );
		} );
		const values = series.map( function ( point ) {
			return parseInt( point[ 1 ], 10 );
		} );

		setState( chartWrapper, 'ready' );

		const canvas = document.getElementById( 'sc-search-volume-chart' );
		if ( ! canvas ) {
			return;
		}

		canvas.setAttribute(
			'aria-label',
			'Search volume: ' + totalSearches.toLocaleString() + ' total searches'
		);

		if ( scChart && ! isInitial ) {
			scChart.data.labels             = labels;
			scChart.data.datasets[ 0 ].data = values;
			scChart.update( 'none' );
		} else {
			if ( scChart ) {
				scChart.destroy();
			}
			scChart = new Chart( canvas, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [ {
						data:        values,
						borderColor: '#2271b1',
						backgroundColor: function ( context ) {
							const chart    = context.chart;
							const ctx      = chart.ctx;
							const area     = chart.chartArea;
							if ( ! area ) {
								return 'rgba(34,113,177,0)';
							}
							const gradient = ctx.createLinearGradient( 0, area.top, 0, area.bottom );
							gradient.addColorStop( 0, 'rgba(34,113,177,0.15)' );
							gradient.addColorStop( 1, 'rgba(34,113,177,0)' );
							return gradient;
						},
						borderWidth: 2,
						fill:        true,
						tension:     0.4,
						pointRadius: 0,
					} ],
				},
				options: {
					responsive:          true,
					maintainAspectRatio: false,
					plugins: {
						legend:  { display: false },
						tooltip: { mode: 'index', intersect: false },
					},
					scales: {
						x: {
							grid:   { color: '#f0f0f1' },
							ticks:  { color: '#667586', font: { size: 12 } },
						},
						y: {
							beginAtZero: true,
							grid:        { color: '#f0f0f1' },
							ticks:       { color: '#667586', font: { size: 12 }, precision: 0 },
						},
					},
				},
			} );
		}
	}

	function setChartError( chartWrapper, isInitial ) {
		if ( isInitial || ! scChart ) {
			const errText = chartWrapper.querySelector( '.sc-chart-error-text' );
			setText( errText, 'Could not load chart data.' );
			setState( chartWrapper, 'error' );
		}
	}

	let scLastRefreshedTs = 0;
	let scRefreshInterval = null;
	const MIN_SPIN_MS     = 800;

	function initRefreshButton() {
		const btn = document.getElementById( 'sc-refresh-btn' );
		if ( ! btn ) {
			return;
		}

		updateLastRefreshedLabel();

		if ( scLastRefreshedTs > 0 ) {
			scRefreshInterval = setInterval( updateLastRefreshedLabel, 30000 );
		}

		btn.addEventListener( 'click', function () {
			if ( btn.disabled ) {
				return;
			}
			doRefresh( btn );
		} );
	}

	function updateLastRefreshedLabel() {
		const label = document.getElementById( 'sc-last-refreshed' );
		if ( ! label ) {
			return;
		}
		if ( ! scLastRefreshedTs ) {
			label.style.display = 'none';
			return;
		}
		const diffMs  = Date.now() - ( scLastRefreshedTs * 1000 );
		const diffMin = Math.floor( diffMs / 60000 );
		let text;
		if ( diffMin < 1 ) {
			text = 'Last refreshed just now';
		} else if ( 1 === diffMin ) {
			text = 'Last refreshed 1m ago';
		} else if ( diffMin < 60 ) {
			text = 'Last refreshed ' + diffMin + 'm ago';
		} else {
			const diffHr = Math.floor( diffMin / 60 );
			text = 1 === diffHr ? 'Last refreshed 1h ago' : 'Last refreshed ' + diffHr + 'h ago';
		}
		setText( label, text );
		label.style.display = '';
	}

	function doRefresh( btn ) {
		if ( typeof scAnalytics === 'undefined' ) {
			return;
		}

		const spinStart = Date.now();
		btn.disabled = true;
		btn.classList.add( 'is-spinning' );

		const xhr = new XMLHttpRequest();
		xhr.open( 'POST', ajaxurl, true );
		xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

		xhr.onload = function () {
			const remaining = Math.max( 0, MIN_SPIN_MS - ( Date.now() - spinStart ) );

			if ( xhr.status !== 200 ) {
				setTimeout( function () {
					btn.disabled = false;
					btn.classList.remove( 'is-spinning' );
					renderNotice( 'error', 'Analytics refresh failed. Cached data is still shown.' );
				}, remaining );
				return;
			}
			let resp;
			try {
				resp = JSON.parse( xhr.responseText );
			} catch ( e ) {
				setTimeout( function () {
					btn.disabled = false;
					btn.classList.remove( 'is-spinning' );
					renderNotice( 'error', 'Analytics refresh failed. Cached data is still shown.' );
				}, remaining );
				return;
			}
			if ( ! resp.success ) {
				setTimeout( function () {
					btn.disabled = false;
					btn.classList.remove( 'is-spinning' );
					renderNotice( 'error', 'Analytics refresh failed. Cached data is still shown.' );
				}, remaining );
				return;
			}

			window.scAnalyticsHelpers.fetchAnalyticsSum();
			window.scAnalyticsHelpers.fetchChartData( window.scAnalyticsHelpers.getCurrentRange(), true );

			const newTs = resp.data && resp.data.timestamp
				? parseInt( resp.data.timestamp, 10 )
				: Math.floor( Date.now() / 1000 );

			setTimeout( function () {
				btn.disabled = false;
				btn.classList.remove( 'is-spinning' );
				scLastRefreshedTs = newTs;
				updateLastRefreshedLabel();
				if ( ! scRefreshInterval ) {
					scRefreshInterval = setInterval( updateLastRefreshedLabel, 30000 );
				}
				renderNotice( 'success', 'Analytics refreshed — data was already current.', { autoDismissMs: 4000 } );
			}, remaining );
		};

		xhr.onerror = function () {
			const remaining = Math.max( 0, MIN_SPIN_MS - ( Date.now() - spinStart ) );
			setTimeout( function () {
				btn.disabled = false;
				btn.classList.remove( 'is-spinning' );
				renderNotice( 'error', 'Analytics refresh failed. Cached data is still shown.' );
			}, remaining );
		};

		const params =
			'action=searchcraft_refresh_analytics' +
			'&nonce=' + encodeURIComponent( scAnalytics.nonce );

		xhr.send( params );
	}

	function initRetryHandlers() {
		document.addEventListener( 'click', function ( e ) {
			const metricBtn  = e.target.closest( '.sc-metric-retry' );
			const popularBtn = e.target.closest( '.sc-popular-terms-retry' );
			if ( metricBtn ) {
				e.preventDefault();
				const metric = metricBtn.getAttribute( 'data-metric' );
				if ( metric === 'dau' || metric === 'mau' ) {
					const dauCard = document.getElementById( 'sc-metric-card-dau' );
					const mauCard = document.getElementById( 'sc-metric-card-mau' );
					if ( dauCard ) { setState( dauCard, 'loading' ); }
					if ( mauCard ) { setState( mauCard, 'loading' ); }
					fetchAnalyticsSum();
				}
			} else if ( popularBtn ) {
				e.preventDefault();
				const wrapper = document.getElementById( 'sc-popular-terms-wrapper' );
				if ( wrapper ) { setState( wrapper, 'loading' ); }
				fetchAnalyticsSum();
			}
		} );
	}

	function boot() {
		scLastRefreshedTs = ( typeof scAnalytics !== 'undefined' && scAnalytics.lastRefresh )
			? parseInt( scAnalytics.lastRefresh, 10 )
			: 0;
		fetchAnalyticsSum();
		initSearchVolumeChart();
		initRetryHandlers();
		initRefreshButton();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}

	window.scAnalyticsHelpers = {
		setState:          setState,
		setText:           setText,
		renderNotice:      renderNotice,
		fetchAnalyticsSum: fetchAnalyticsSum,
		fetchChartData:    function ( range, isInitial ) {
			return fetchChartData( range || scCurrentRange, isInitial !== false );
		},
		getCurrentRange: function () {
			return scCurrentRange;
		},
		doRefresh: function () {
			const btn = document.getElementById( 'sc-refresh-btn' );
			if ( btn && ! btn.disabled ) {
				doRefresh( btn );
			}
		},
	};
}() );
