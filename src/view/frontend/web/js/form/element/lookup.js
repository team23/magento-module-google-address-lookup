define([
    'jquery',
    'Magento_Ui/js/form/element/abstract',
    'Team23_GoogleAddressLookup/js/maps/loader',
    'Team23_GoogleAddressLookup/js/maps/helper',
], ($, Abstract, GoogleMapsLoader, Helper) => {
    'use strict';

    let autocomplete = null;

    return Abstract.extend({
        defaults: {
            restrictedCountries: $('#google-address-lookup-restricted-countries').val(),
            isActive: parseInt($('#google-address-lookup-active').val(), 10),
        },

        initObservable: function() {
            this._super();

            return this;
        },

        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions,no-unused-vars,@typescript-eslint/no-unused-vars
        initAddressLookup: function(element) {
            const self = this;
            const selector = Helper.getAutocompleteFieldName();

            if (selector !== false && self.isActive) {
                GoogleMapsLoader.done(() => {
                    const options = {
                        types: ['geocode'],
                        fields: ['address_components'],
                    };

                    if (self.restrictedCountries !== undefined && self.restrictedCountries !== '') {
                        options.componentRestrictions = { country: self.restrictedCountries.split(',') };
                    }

                    // eslint-disable-next-line no-undef
                    autocomplete = new google.maps.places.Autocomplete(document.querySelector(selector), options);
                    autocomplete.addListener('place_changed', self.updateFormValues);
                    $(selector).on('focus', self.geoLocate);
                }).fail(() => {
                    console.error('[ERROR] Google Maps library failed to load.');
                });
            }
        },

        /**
         * Use navigator geo location
         */
        geoLocate: () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    // eslint-disable-next-line no-undef
                    const circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy,
                    });

                    autocomplete.setBounds(circle.getBounds());
                });
            }
        },

        /**
         * Update form values
         */
        updateFormValues: () => {
            const place = autocomplete.getPlace();
            const street = [];
            const streetNumber = [];
            const postcode = [];
            let city = '';
            let region = '';
            let country_id = '';
            let streetIndex = 0;
            let streetNumberIndex = 0;

            for (const component of place.address_components) {
                const componentType = component.types[0];

                switch (componentType) {
                    case 'route':
                        street[streetIndex] = component.long_name;
                        streetIndex++;
                        break;
                    case 'subpremise':
                        streetNumber[streetNumberIndex] = `${ component.short_name }/`;
                        streetNumberIndex++;
                        break;
                    case 'street_number':
                        streetNumber[streetNumberIndex] = component.long_name;
                        streetNumberIndex++;
                        break;
                    case 'locality':
                        city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        region = component.long_name;
                        break;
                    case 'country':
                        country_id = component.short_name;
                        break;
                    case 'postal_code':
                        postcode[0] = component.long_name;
                        break;
                    case 'postal_code_suffix':
                        postcode[1] = component.short_name;
                        break;
                    default:
                        break;
                }
            }

            if (Helper.getScope() === 'cart') {
                Helper.fillInCart({
                    region_id: region,
                    country_id,
                    postcode: postcode.join('-'),
                });
            } else {
                street[streetIndex] = streetNumber.join(' ');
                Helper.fillInCheckoutAddressData({
                    street: street.join(' '),
                    city,
                    region_id: region,
                    country_id,
                    postcode: postcode.join('-'),
                });
            }
        },
    });
});
