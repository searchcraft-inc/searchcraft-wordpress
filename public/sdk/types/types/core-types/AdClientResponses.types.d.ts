export interface ADMResponse {
    partial_qt: string;
    text_ads: ADMAd[];
    product_ads: ADMAd[];
}
export interface AdClientResponseItem {
    id: string;
}
export interface ADMClientResponseItem extends AdClientResponseItem {
    admAdType: 'adm-text-ad' | 'adm-product-ad';
    admAd?: ADMAd;
}
export interface ADMAd {
    adv_id: number;
    adv_name: string;
    click_url?: string;
    image_url?: string;
    impression_url?: string;
    price?: number;
    price_currency?: string;
    sale_price?: number;
    term: string;
}
//# sourceMappingURL=AdClientResponses.types.d.ts.map