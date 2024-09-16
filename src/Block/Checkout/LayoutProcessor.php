<?php
declare(strict_types=1);

namespace Team23\GoogleAddressLookup\Block\Checkout;

use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Team23\GoogleAddressLookup\Api\ConfigManagerInterface;

class LayoutProcessor implements LayoutProcessorInterface
{
    /**
     * @param ConfigManagerInterface $configManager
     */
    public function __construct(
        private readonly ConfigManagerInterface $configManager
    ) {
    }

    /**
     * @inheritDoc
     */
    public function process($jsLayout)
    {
        if (!$this->configManager->isEnabled()) {
            return $jsLayout;
        }

        $jsLayout = $this->processForPaymentMethods($jsLayout);
        return $this->processForBillingAddress($jsLayout);
    }

    /**
     * Add non-visible field to billing address
     *
     * @param array $jsLayout
     * @return array
     */
    private function processForBillingAddress(array $jsLayout): array
    {
        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
            ['children']['payment']['children']['afterMethods']['children']['billing-address-form']
            ['children']['form-fields'])) {
            $field = [
                'component' => 'Team23_GoogleAddressLookup/js/form/element/lookup',
                'config' => [
                    'customScope' => 'billingAddress',
                    'template' => 'ui/form/field',
                    'elementTmpl' => 'Team23_GoogleAddressLookup/form/element/input',
                    'additionalClasses' => 'uiph-hidelabel uiph-hideasterisk'
                ],
                'dataScope' => 'billingAddress.lookup',
                'label' => '',
                'provider' => 'checkoutProvider',
                'sortOrder' => '900',
                'options' => [],
                'filterBy' => null,
                'customEntry' => null,
                'visible' => false,
                'placeholder' => '',
                'processed' => true,
            ];

            $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
            ['children']['payment']['children']['afterMethods']['children']['billing-address-form']
            ['children']['form-fields']['children']['lookup'] = $field;
        }
        return $jsLayout;
    }

    /**
     * Add non-visible field to payment methods
     *
     * @param array $jsLayout
     * @return array
     */
    private function processForPaymentMethods(array $jsLayout): array
    {
        $paymentMethodRenders = $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
        ['children']['payment']['children']['payments-list']['children'];

        if (!is_array($paymentMethodRenders)) {
            return $jsLayout;
        }

        foreach ($paymentMethodRenders as $name => $renderer) {
            if (isset($renderer['children']) && array_key_exists('form-fields', $renderer['children'])) {
                $field = [
                    'component' => 'Team23_GoogleAddressLookup/js/form/element/lookup',
                    'config' => [
                        'customScope' => 'billingAddress' . str_replace('-form', '', $name),
                        'template' => 'ui/form/field',
                        'elementTmpl' => 'Team23_GoogleAddressLookup/form/element/input',
                        'additionalClasses' => 'uiph-hidelabel uiph-hideasterisk'
                    ],
                    'dataScope' => 'billingAddress' . str_replace('-form', '', $name) . '.lookup',
                    'label' => '',
                    'provider' => 'checkoutProvider',
                    'sortOrder' => '900',
                    'options' => [],
                    'filterBy' => null,
                    'customEntry' => null,
                    'visible' => false,
                    'placeholder' => '',
                    'processed' => true,
                ];

                $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
                ['children']['payment']['children']['payments-list']['children'][$name]['children']
                ['form-fields']['children']['lookup'] = $field;
            }
        }
        return $jsLayout;
    }
}
