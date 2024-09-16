<?php
declare(strict_types=1);

namespace Team23\GoogleAddressLookup\Api;

interface ConfigManagerInterface
{
    /**
     * Is module enabled
     *
     * @param int|string|null $scopeCode
     * @return bool
     */
    public function isEnabled(int|string $scopeCode = null): bool;

    /**
     * Retrieve API key
     *
     * @param int|string|null $scopeCode
     * @return string
     */
    public function getApiKey(int|string $scopeCode = null): string;

    /**
     * Retrieve restricted countries
     *
     * @param int|string|null $scopeCode
     * @return array
     */
    public function getRestrictedCountries(int|string $scopeCode = null): array;
}
