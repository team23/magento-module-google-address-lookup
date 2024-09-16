<?php
declare(strict_types=1);

namespace Team23\GoogleAddressLookup\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Team23\GoogleAddressLookup\Api\ConfigManagerInterface;

class GoogleAddressLookup implements ArgumentInterface
{
    /**
     * @param ConfigManagerInterface $configManager
     */
    public function __construct(
        private readonly ConfigManagerInterface $configManager
    ) {
    }

    /**
     * Is module enabled
     *
     * @param int|string|null $scopeCode
     * @return string
     */
    public function isEnabled(int|string $scopeCode = null): string
    {
        return (string)(int)$this->configManager->isEnabled($scopeCode);
    }

    /**
     * Retrieve API key
     *
     * @param int|string|null $scopeCode
     * @return string
     */
    public function getApiKey(int|string $scopeCode = null): string
    {
        return $this->configManager->getApiKey($scopeCode);
    }

    /**
     * Retrieve restricted countries
     *
     * @param int|string|null $scopeCode
     * @return string
     */
    public function getRestrictedCountries(int|string $scopeCode = null): string
    {
        $restrictedCountries = $this->configManager->getRestrictedCountries($scopeCode);
        if (empty($restrictedCountries)) {
            return '';
        }
        return implode(',', $restrictedCountries);
    }
}
