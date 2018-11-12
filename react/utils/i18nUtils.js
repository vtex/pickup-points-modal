export const translate = (intl, id, values) =>
  intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)
