<?php
declare(strict_types=1);

namespace Team23\GoogleAddressLookup\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Team23\GoogleAddressLookup\Api\ConfigManagerInterface;

class ConfigManager implements ConfigManagerInterface
{
    public const XML_PATH_IS_ENABLED = 'google_address_lookup/general/active';
    public const XML_PATH_API_KEY = 'google_address_lookup/general/api_key';
    public const XML_PATH_RESTRICTED_COUNTRIES = 'google_address_lookup/general/restricted_countries';

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig
    ) {
    }

    /**
     * @inheritDoc
     */
    public function isEnabled(int|string $scopeCode = null): bool
    {
        return (bool)$this->scopeConfig->isSetFlag(self::XML_PATH_IS_ENABLED, ScopeInterface::SCOPE_STORE, $scopeCode);
    }

    /**
     * @inheritDoc
     */
    public function getApiKey(int|string $scopeCode = null): string
    {
        return (string)$this->scopeConfig->getValue(self::XML_PATH_API_KEY, ScopeInterface::SCOPE_STORE, $scopeCode);
    }

    /**
     * @inheritDoc
     */
    public function getRestrictedCountries(int|string $scopeCode = null): array
    {
        $restrictedCountries = (string)$this->scopeConfig->getValue(
            self::XML_PATH_RESTRICTED_COUNTRIES,
            ScopeInterface::SCOPE_STORE,
            $scopeCode
        );
        $restrictedCountries = explode(',', $restrictedCountries);
        return $restrictedCountries ?: [];
    }
}
