/**
 * Searchcraft Analytics — state machine helpers, metric cards, and chart.
 *
 * IMPORTANT: innerHTML is BANNED in this file.
 * All user-visible string values must go through setText() which sets
 * textContent only. This contract prevents XSS — especially for
 * popular_terms[].term values populated in Story 6.
 *
 * @package Searchcraft
 * @since   1.5.0
 */

/* global ajaxurl, scAnalytics, Chart */
( function () {
	'use strict';

	// =========================================================================
	// Story 7 — State machine helpers
	// =========================================================================

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

	// =========================================================================
	// Story 7 — Notice helper
	// =========================================================================

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

	// =========================================================================
	// Story 3 — Analytics summary (DAU / MAU) cards
	// =========================================================================

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
	}

	// =========================================================================
	// Story 4 — Search Volume chart
	// =========================================================================

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

		// Initial data load.
		fetchChartData( scCurrentRange, true );

		// Range tab clicks.
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

				// Update active tab state.
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

		// Chart retry.
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
			// is-loading: stale chart stays visible, canvas dims.
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
		const totalSearches   = parseInt( data.total_searches, 10 ) || 0;
		const series          = Array.isArray( data.chart_series ) ? data.chart_series : [];
		const totalEl         = document.getElementById( 'sc-total-searches-value' );
		const totalWrapper    = document.querySelector( '.sc-total-searches' );

		// Update Total Searches headline.
		if ( totalEl && totalWrapper ) {
			if ( totalSearches === 0 ) {
				setText( totalEl, '—' );
				setState( totalWrapper, 'empty' );
			} else {
				setText( totalEl, totalSearches.toLocaleString() );
				setState( totalWrapper, 'ready' );
			}
		}

		// Empty state: no series data.
		if ( series.length === 0 ) {
			setState( chartWrapper, 'empty' );
			return;
		}

		// Convert [[timestamp_str, count]] to Chart.js labels + values.
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

		// Update accessible label.
		canvas.setAttribute(
			'aria-label',
			'Search volume: ' + totalSearches.toLocaleString() + ' total searches'
		);

		if ( scChart && ! isInitial ) {
			// In-place update — no destroy/recreate.
			scChart.data.labels            = labels;
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
							var chart    = context.chart;
							var ctx      = chart.ctx;
							var area     = chart.chartArea;
							if ( ! area ) {
								return 'rgba(34,113,177,0)';
							}
							var gradient = ctx.createLinearGradient( 0, area.top, 0, area.bottom );
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
		// If not initial and we have existing chart, leave stale data visible.
	}

	// =========================================================================
	// Retry handlers (metric cards — event delegation)
	// =========================================================================

	function initRetryHandlers() {
		document.addEventListener( 'click', function ( e ) {
			const btn = e.target.closest( '.sc-metric-retry' );
			if ( ! btn ) {
				return;
			}
			e.preventDefault();
			const metric = btn.getAttribute( 'data-metric' );
			if ( metric === 'dau' || metric === 'mau' ) {
				const dauCard = document.getElementById( 'sc-metric-card-dau' );
				const mauCard = document.getElementById( 'sc-metric-card-mau' );
				if ( dauCard ) { setState( dauCard, 'loading' ); }
				if ( mauCard ) { setState( mauCard, 'loading' ); }
				fetchAnalyticsSum();
			}
		} );
	}

	// =========================================================================
	// DOM-ready bootstrap
	// =========================================================================

	function boot() {
		fetchAnalyticsSum();
		initSearchVolumeChart();
		initRetryHandlers();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}

	// Expose helpers for Story 5 (refresh button) and Story 6 (popular terms).
	window.scAnalyticsHelpers = {
		setState:         setState,
		setText:          setText,
		renderNotice:     renderNotice,
		fetchAnalyticsSum: fetchAnalyticsSum,
		fetchChartData:   function ( range, isInitial ) {
			return fetchChartData( range || scCurrentRange, isInitial !== false );
		},
		getCurrentRange: function () {
			return scCurrentRange;
		},
	};
}() );
