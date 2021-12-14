# Pickup Points Modal

> A React component that renders VTEX's pickup points modal

## Setup

Through **NPM**:

```sh
$ npm install @vtex/pickup-points-modal
```

```js
import PickupPointsModal from '@vtex/pickup-points-modal/PickupPointsModal'
```

Through **vtex.io**:

Add `vtex.pickup-points-modal` to your `manifest.json` dependencies

```js
import { PickupPointsModal } from 'vtex.pickup-points-modal'
```

## API

### Base Component

- [PickupPointsModal](#PickupPointsModal)

---

## Base Component

### PickupPointsModal

This component renders the modal with a list of pickup points and a map with markers

#### Props

- **`closePickupPointsModal`**: Callback function to be called when PickupPointsModal is closed
- **`changeActiveSLAOption`**: Callback function to be called when a pickup is selected
- **`changeActivePickupDetails`**: Callback function to be called when PickupPointDetails state is changed
- **`googleMapsKey`**: The Google Maps API Key
- **`items`**: Items array from `orderForm` to get the products information
- **`isPickupDetailsActive`**: (default: `false`) If the PickupPointDetails is active and should be rendered
- **`logisticsInfo`**: LogisticsInfo array from `orderForm` to get sla information
- **`onAddressChange`**: Callback function to be called when a the search field has changed
- **`pickupOptions`**: Array of pickup points (SLAs of type `pickup-in-point`)
- **`searchAddress`**: The current address used for the search input in the shape of [`AddressShapeWithValidation`](https://github.com/vtex/address-form/blob/master/react/propTypes/AddressShapeWithValidation.js)
- **`selectedPickupPoint`**: Current selected SLA of type `pickup-in-point`
- **`rules`**: The selected country rules from [`AddressForm`](https://github.com/vtex/address-form/tree/master/react/country)
- **`sellerId`**: The Id of the seller when the list of pickups is filtered by seller
- **`storePreferencesData`**: Object from `orderForm` to get currency preferences from store
- **`salesChannel`**: String from `orderForm` to get the sales channel used in the checkout simulation
- **`orderFormId`**: String from `orderForm` used in the checkout simulation

```js
PickupPointsModal.propTypes = {
  closePickupPointsModal: PropTypes.func.isRequired,
  changeActivePickupDetails: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  googleMapsKey: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  isPickupDetailsActive: PropTypes.bool,
  logisticsInfo: PropTypes.array.isRequired
  onAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  rules: PropTypes.object,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
  salesChannel: PropTypes.string.isRequired,
  orderFormId: PropTypes.string.isRequired,
};
```

#### Example

```js
<PickupPointsModal
  closePickupPointsModal={this.closePickupModal}
  changeActivePickupDetails={this.changeActivePickupDetails}
  changeActiveSLAOption={this.changeActiveSLAOption}
  googleMapsKey={googleMapsKey}
  intl={intl}
  items={items}
  isPickupDetailsActive={isPickupDetailsActive}
  logisticsInfo={logisticsInfo}
  onAddressChange={this.handleAddressChange}
  orderFormId={orderFormId}
  pickupOptions={pickupOptions}
  searchAddress={searchAddress}
  selectedPickupPoint={selectedPickupPoint}
  selectedRules={selectedRules}
  sellerId={sellerId}
  storePreferencesData={storePreferencesData}
  salesChannel={salesChannel}
/>
```

## Usage Metrics
You can track how the users are interacting with the pickup points modal via [this Kibana dashboard](https://search-storedash-data-3-32cfdpt6mog2la33veml5chk5u.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana#/dashboard/1ebe2740-5ce4-11ec-ae80-8bab55ad9e44?_g=(refreshInterval:(pause:!f,value:60000),time:(from:now-15m,mode:quick,to:now))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(vis:(legendOpen:!t)),gridData:(h:15,i:'1',w:24,x:0,y:0),id:aa08f140-5c4e-11ec-9abe-e1e2cda1bc0b,panelIndex:'1',type:visualization,version:'6.8.0'),(embeddableConfig:(),gridData:(h:15,i:'2',w:24,x:24,y:0),id:'8f2006f0-4215-11ec-904f-bb8ea826d116',panelIndex:'2',type:visualization,version:'6.8.0')),query:(language:lucene,query:''),timeRestore:!f,title:'Checkout%20-%20Pickup%20Points%20Modal',viewMode:view)) (requires being logged on to the AWS VPN).

<img width="1779" alt="Captura de Tela 2021-12-14 às 15 02 38" src="https://user-images.githubusercontent.com/5691711/146065460-a22bee02-2602-44e5-a6d5-e9a4eee0e157.png">

It might be of interest to keep an eye on it after deployments, to see if and how it affects user experience. Particularly, you can track if the pickup point selection "conversion rate" has gone up or down by comparing how often the modal has been opened vs. how often the users actually end up selecting a pickup point.

<img width="398" alt="Captura de Tela 2021-12-14 às 15 14 24" src="https://user-images.githubusercontent.com/5691711/146065519-ba6fe179-0eb3-4ea9-9567-372f4ef508b7.png">


