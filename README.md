# TEAM23 Google Address Lookup

Auto-completes the address fields in your Magento 2 stores with [Google Place Autocomplete API](https://developers.google.com/maps/documentation/javascript/place-autocomplete).

## Installation

Installation is done via composer

```shell
composer require team23/module-google-address-lookup
```

Now register the module with `bin/magento setup:upgrade`.

## Configuration

To enable extension and set the API Key in Magento backend, go to `System > Configuration > TEAM23 > Google Address
Lookup`. You are also able to [restrict](https://developers.google.com/maps/documentation/javascript/place-autocomplete?hl=de#restrict-predictions-to-a-specific-country) 
the Autocomplete API to desired countries.

After enabling the extension with a working API key, the module will work in customer account for address
editing/creating and in the checkout for shipping and billing address. By typing into (the first) street field, the 
autocomplete pop-ups.

## Extensibility

Extension developers can interact with the `Team23_GoogleAddressLookup` module. For more information about the Magento extension
mechanism, see [Magento plug-ins](https://developer.adobe.com/commerce/php/development/components/plugins/).

[The Magento dependency injection mechanism](https://developer.adobe.com/commerce/php/development/components/dependency-injection/)
enables you to override the functionality of the `Team23_GoogleAddressLookup` module.
