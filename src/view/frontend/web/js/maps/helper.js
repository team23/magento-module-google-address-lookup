define([
    'jquery',
    'uiRegistry',
    'Magento_Checkout/js/model/step-navigator',
], ($, uiRegistry, stepNavigator) => {
    'use strict';

    return {
        /**
         * Retrieve current scope
         */
        getScope: () => {
            const bodyElement = $('body');

            if (bodyElement.hasClass('customer-address-form')) {
                return 'customer';
            } else if (bodyElement.hasClass('checkout-cart-index')) {
                return 'cart';
            }

            return 'checkout';
        },

        /**
         * Retrieve field name for autocomplete
         */
        getAutocompleteFieldName: function() {
            if (this.getScope() === 'customer') {
                return '#street_1';
            } else if (this.getScope() === 'cart') {
                return 'input[name="postcode"]';
            } else if (this.getScope() === 'checkout') {
                return `#${ this.getCheckoutField('street') }`;
            }

            return false;
        },

        /**
         * Retrieve field as jquery element from checkout
         */
        getCheckoutField: function(fieldName) {
            let path = 'checkout.steps.';

            if (this.getActiveCheckoutStep() === 'payment') {
                path += 'billing-step.payment.';

                if (window.checkoutConfig.displayBillingOnPaymentMethod) {
                    path += `payments-list.${ this.getActivePaymentMethod() }-form.form-fields.${ fieldName }`;
                } else {
                    path += `afterMethods.billing-address-form.form-fields.${ fieldName }`;
                }
            } else {
                path += `shipping-step.shippingAddress.shipping-address-fieldset.${ fieldName }`;
            }

            if (uiRegistry.get(path) !== null) {
                if (fieldName === 'street') {
                    return uiRegistry.get(path).elems()[0].uid;
                }

                return uiRegistry.get(path).uid;
            }

            return false;
        },

        /**
         * Fill in customer address data
         */
        fillInCustomerAddress: function(addressData) { // eslint-disable-line prefer-arrow/prefer-arrow-functions
            const fieldKeys = Object.keys(addressData);

            fieldKeys.forEach(fieldName => {
                const field = $(`#${ fieldName }`);

                field.val(addressData[fieldName]);
                field.trigger('change');
            });
        },

        /**
         * Fill in cart address data
         */
        fillInCart: function(addressData) { // eslint-disable-line prefer-arrow/prefer-arrow-functions
            const fieldKeys = Object.keys(addressData);

            fieldKeys.forEach(fieldName => {
                const field = $(`[name="${ fieldName }"]`);

                field.val(addressData[fieldName]);
                field.trigger('change');
            });
        },

        /**
         * Fill in checkout address data
         */
        fillInCheckoutAddressData: function(addressData) {
            const fieldKeys = Object.keys(addressData);

            fieldKeys.forEach(fieldName => {
                const field = $(`#${ this.getCheckoutField(fieldName) }`);

                if (field !== false) {
                    field.val(addressData[fieldName]);
                    field.trigger('change');
                }
            });
        },

        /**
         * Retrieve active checkout step
         */
        getActiveCheckoutStep: () => stepNavigator.steps()[stepNavigator.getActiveItemIndex()].code,

        /**
         * Retrieve active payment method
         */
        getActivePaymentMethod: () => $('input[name="payment[method]"]:checked').val(),
    };
});
