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
		el?.setAttribute( 'data-state', state );
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
	function renderNotice( type, message, opts = {} ) {
		const { dismissible = true, autoDismissMs = null } = opts;

		const wrap     = document.createElement( 'div' );
		wrap.className = `notice notice-${ type }${ dismissible ? ' is-dismissible' : '' }`;
		wrap.setAttribute( 'aria-live', 'polite' );
		if ( ! dismissible ) wrap.setAttribute( 'role', 'alert' );

		const p = document.createElement( 'p' );
		setText( p, message );
		wrap.appendChild( p );

		if ( dismissible ) {
			const btn     = document.createElement( 'button' );
			btn.type      = 'button';
			btn.className = 'notice-dismiss';
			const sr      = document.createElement( 'span' );
			sr.className  = 'screen-reader-text';
			setText( sr, 'Dismiss this notice.' );
			btn.appendChild( sr );
			btn.addEventListener( 'click', () => wrap.remove() );
			wrap.appendChild( btn );
		}

		const target = document.querySelector( '.wrap' ) ?? document.body;
		target.insertBefore( wrap, target.firstChild );

		if ( autoDismissMs ) {
			setTimeout( () => wrap.remove(), autoDismissMs );
		}

		return wrap;
	}

	/**
	 * Fire a WP admin-ajax POST and resolve with resp.data.
	 * Rejects on HTTP error, JSON parse failure, or wp_send_json_error.
	 *
	 * @param {string}      action
	 * @param {Object}      [params={}]
	 * @param {AbortSignal} [signal]
	 * @returns {Promise<Object>}
	 */
	async function wpAjax( action, params = {}, signal ) {
		const body = new URLSearchParams( {
			action,
			nonce: scAnalytics.nonce,
			...params,
		} );
		const response = await fetch( ajaxurl, {
			method:  'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body:    body.toString(),
			signal,
		} );
		if ( ! response.ok ) throw new Error( `HTTP ${ response.status }` );
		const json = await response.json();
		if ( ! json.success ) throw new Error( 'wp_send_json_error' );
		return json.data;
	}

	async function fetchAnalyticsSum( range ) {
		if ( typeof scAnalytics === 'undefined' ) return;

		const dauCard = document.getElementById( 'sc-metric-card-dau' );
		const mauCard = document.getElementById( 'sc-metric-card-mau' );
		if ( ! dauCard && ! mauCard ) return;

		try {
			const data = await wpAjax( 'searchcraft_analytics_sum', {
				range: range ?? scCurrentRange,
			} );
			const { daily_active_users, monthly_active_users, popular_terms = [] } = data;
			if ( dauCard ) applyMetricValue( dauCard, parseInt( daily_active_users, 10 ) );
			if ( mauCard ) applyMetricValue( mauCard, parseInt( monthly_active_users, 10 ) );
			renderPopularTerms( popular_terms );
		} catch {
			setSumCardsError( dauCard, mauCard );
		}
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
		if ( ! wrapper ) return;

		if ( ! Array.isArray( terms ) || terms.length === 0 ) {
			setState( wrapper, 'empty' );
			return;
		}

		const tbody = document.getElementById( 'sc-popular-terms-tbody' );
		if ( tbody ) {
			tbody.replaceChildren();
			for ( const { term = '', count = 0 } of terms ) {
				const tr      = document.createElement( 'tr' );
				const tdTerm  = document.createElement( 'td' );
				const tdCount = document.createElement( 'td' );
				tdTerm.setAttribute( 'data-colname', 'Search Term' );
				tdCount.setAttribute( 'data-colname', 'Count' );
				setText( tdTerm, term );
				setText( tdCount, count.toLocaleString() );
				tr.append( tdTerm, tdCount );
				tbody.appendChild( tr );
			}
		}
		setState( wrapper, 'ready' );
	}

	function setPopularTermsError() {
		const wrapper = document.getElementById( 'sc-popular-terms-wrapper' );
		if ( ! wrapper ) return;
		setText( wrapper.querySelector( '.sc-popular-terms-error-text' ), 'Could not load popular search terms.' );
		setState( wrapper, 'error' );
	}

	let scChart          = null;
	let scCurrentRange   = window.scAnalytics?.defaultRange ?? '1w';
	let scChartAbortCtrl = null;

	function initSearchVolumeChart() {
		const chartWrapper = document.getElementById( 'sc-chart-wrapper' );
		if ( ! chartWrapper || typeof Chart === 'undefined' ) return;

		fetchChartData( scCurrentRange, true );

		const tabList = document.querySelector( '.sc-range-tabs' );
		tabList?.addEventListener( 'click', ( e ) => {
			const tab   = e.target.closest( '.sc-range-tab' );
			const range = tab?.getAttribute( 'data-range' );
			if ( ! range || range === scCurrentRange ) return;

			tabList.querySelectorAll( '.sc-range-tab' ).forEach( ( t ) => {
				t.setAttribute( 'aria-selected', 'false' );
				t.classList.remove( 'sc-range-tab-active' );
			} );
			tab.setAttribute( 'aria-selected', 'true' );
			tab.classList.add( 'sc-range-tab-active' );

			scCurrentRange = range;
			fetchChartData( range, false );

			setState( document.getElementById( 'sc-popular-terms-wrapper' ), 'loading' );
			fetchAnalyticsSum( range );
		} );

		chartWrapper.addEventListener( 'click', ( e ) => {
			if ( ! e.target.closest( '.sc-chart-retry' ) ) return;
			e.preventDefault();
			setState( chartWrapper, 'loading' );
			fetchChartData( scCurrentRange, true );
		} );
	}

	async function fetchChartData( range, isInitial ) {
		if ( typeof scAnalytics === 'undefined' ) return;

		const chartCard    = document.getElementById( 'sc-chart-card' );
		const chartWrapper = document.getElementById( 'sc-chart-wrapper' );
		const tabList      = document.querySelector( '.sc-range-tabs' );
		if ( ! chartWrapper ) return;

		scChartAbortCtrl?.abort();
		scChartAbortCtrl = new AbortController();

		if ( isInitial ) {
			setState( chartWrapper, 'loading' );
		} else {
			chartCard?.classList.add( 'is-loading' );
			tabList?.setAttribute( 'aria-busy', 'true' );
		}

		try {
			const data = await wpAjax(
				'searchcraft_analytics_chart',
				{ range },
				scChartAbortCtrl.signal
			);
			clearChartLoadingState( chartCard, tabList );
			renderChart( data, isInitial, chartWrapper );
		} catch ( err ) {
			if ( err.name === 'AbortError' ) return;
			clearChartLoadingState( chartCard, tabList );
			setChartError( chartWrapper, isInitial );
		}
	}

	function clearChartLoadingState( chartCard, tabList ) {
		chartCard?.classList.remove( 'is-loading' );
		tabList?.removeAttribute( 'aria-busy' );
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

		const labels = series.map( ( [ ts ] ) =>
			new Date( parseInt( ts, 10 ) * 1000 ).toLocaleDateString( undefined, { month: 'short', day: 'numeric' } )
		);
		const values = series.map( ( [ , count ] ) => parseInt( count, 10 ) );

		setState( chartWrapper, 'ready' );

		const canvas = document.getElementById( 'sc-search-volume-chart' );
		if ( ! canvas ) return;

		canvas.setAttribute( 'aria-label', `Search volume: ${ totalSearches.toLocaleString() } total searches` );

		if ( scChart && ! isInitial ) {
			scChart.data.labels             = labels;
			scChart.data.datasets[ 0 ].data = values;
			scChart.update( 'none' );
		} else {
			scChart?.destroy();
			scChart = new Chart( canvas, {
				type: 'line',
				data: {
					labels,
					datasets: [ {
						data:            values,
						borderColor:     '#2271b1',
						backgroundColor: ( context ) => {
							const { chart } = context;
							const area      = chart.chartArea;
							if ( ! area ) return 'rgba(34,113,177,0)';
							const gradient = chart.ctx.createLinearGradient( 0, area.top, 0, area.bottom );
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
							grid:  { color: '#f0f0f1' },
							ticks: { color: '#667586', font: { size: 12 } },
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
			setText( chartWrapper.querySelector( '.sc-chart-error-text' ), 'Could not load chart data.' );
			setState( chartWrapper, 'error' );
		}
	}

	let scLastRefreshedTs = 0;
	let scRefreshInterval = null;
	const MIN_SPIN_MS     = 800;

	function initRefreshButton() {
		const btn = document.getElementById( 'sc-refresh-btn' );
		if ( ! btn ) return;

		updateLastRefreshedLabel();
		if ( scLastRefreshedTs > 0 ) {
			scRefreshInterval = setInterval( updateLastRefreshedLabel, 30000 );
		}

		btn.addEventListener( 'click', () => {
			if ( ! btn.disabled ) doRefresh( btn );
		} );
	}

	function updateLastRefreshedLabel() {
		const label = document.getElementById( 'sc-last-refreshed' );
		if ( ! label ) return;

		if ( ! scLastRefreshedTs ) {
			label.style.display = 'none';
			return;
		}

		const diffMin = Math.floor( ( Date.now() - scLastRefreshedTs * 1000 ) / 60000 );
		let text;
		if ( diffMin < 1 )       text = 'Last refreshed just now';
		else if ( diffMin < 60 ) text = `Last refreshed ${ diffMin }m ago`;
		else                     text = `Last refreshed ${ Math.floor( diffMin / 60 ) }h ago`;

		setText( label, text );
		label.style.display = '';
	}

	async function doRefresh( btn ) {
		if ( typeof scAnalytics === 'undefined' ) return;

		const spinStart = Date.now();
		btn.disabled    = true;
		btn.classList.add( 'is-spinning' );

		const waitForSpin = () => new Promise( ( resolve ) =>
			setTimeout( resolve, Math.max( 0, MIN_SPIN_MS - ( Date.now() - spinStart ) ) )
		);
		const stopSpin = () => {
			btn.disabled = false;
			btn.classList.remove( 'is-spinning' );
		};

		try {
			const data = await wpAjax( 'searchcraft_refresh_analytics' );
			fetchAnalyticsSum( scCurrentRange );
			fetchChartData( scCurrentRange, true );
			const newTs = data?.timestamp
				? parseInt( data.timestamp, 10 )
				: Math.floor( Date.now() / 1000 );
			await waitForSpin();
			stopSpin();
			scLastRefreshedTs = newTs;
			updateLastRefreshedLabel();
			if ( ! scRefreshInterval ) {
				scRefreshInterval = setInterval( updateLastRefreshedLabel, 30000 );
			}
			renderNotice( 'success', 'Analytics refreshed — data was already current.', { autoDismissMs: 4000 } );
		} catch {
			await waitForSpin();
			stopSpin();
			renderNotice( 'error', 'Analytics refresh failed. Cached data is still shown.' );
		}
	}

	function initRetryHandlers() {
		document.addEventListener( 'click', ( e ) => {
			const metricBtn  = e.target.closest( '.sc-metric-retry' );
			const popularBtn = e.target.closest( '.sc-popular-terms-retry' );

			if ( metricBtn ) {
				e.preventDefault();
				const metric = metricBtn.getAttribute( 'data-metric' );
				if ( metric === 'dau' || metric === 'mau' ) {
					setState( document.getElementById( 'sc-metric-card-dau' ), 'loading' );
					setState( document.getElementById( 'sc-metric-card-mau' ), 'loading' );
					fetchAnalyticsSum();
				}
			} else if ( popularBtn ) {
				e.preventDefault();
				setState( document.getElementById( 'sc-popular-terms-wrapper' ), 'loading' );
				fetchAnalyticsSum( scCurrentRange );
			}
		} );
	}

	function boot() {
		scLastRefreshedTs = typeof scAnalytics !== 'undefined' && scAnalytics.lastRefresh
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
		setState,
		setText,
		renderNotice,
		fetchAnalyticsSum,
		fetchChartData:  ( range, isInitial ) => fetchChartData( range ?? scCurrentRange, isInitial !== false ),
		getCurrentRange: () => scCurrentRange,
		doRefresh:       () => {
			const btn = document.getElementById( 'sc-refresh-btn' );
			if ( btn && ! btn.disabled ) doRefresh( btn );
		},
	};
}() );
