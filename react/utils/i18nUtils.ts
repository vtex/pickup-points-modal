import type { InjectedIntl, MessageValue } from 'react-intl'

export const translate = (
  intl: InjectedIntl,
  id: string,
  values?: Record<string, MessageValue>
) => intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)
