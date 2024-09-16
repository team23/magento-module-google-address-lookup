define([
    'jquery',
], $ => {
    'use strict';

    const apiKey = $('#google-address-lookup-api-key').val();
    const isActive = parseInt($('#google-address-lookup-active').val(), 10);
    const url = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&loading=async&libraries=places&callback=google_maps_loaded`;
    let google_maps_loaded_deferred = null;

    if (!google_maps_loaded_deferred && isActive) {
        google_maps_loaded_deferred = $.Deferred();
        window.google_maps_loaded = () => {
            google_maps_loaded_deferred.resolve(google.maps); // eslint-disable-line no-undef
        };

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        require([url], () => {}, () => {
            google_maps_loaded_deferred.reject();
        });
    }

    return google_maps_loaded_deferred.promise();
});
