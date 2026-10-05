import { TERMIN_HASH, TERMIN_OVERLAY_EVENT, WORKSHOP_HASH, WORKSHOP_OVERLAY_EVENT } from '../lib/terminOverlay'
import { Overlay } from './Overlay'
import { TerminKalender } from './TerminKalender'
import { WorkshopBuchung } from './WorkshopBuchung'

/**
 * Buchungs-Fenster der Seite (Hülle siehe Overlay.tsx):
 *  - Kennenlerngespräch – Links auf "#kennenlernen" bzw. oeffneTerminOverlay()
 *  - Workshop-Platz – Links auf "#workshop-buchen" bzw. oeffneWorkshopOverlay()
 */
export function TerminOverlay() {
  return (
    <>
      <Overlay hash={TERMIN_HASH} eventName={TERMIN_OVERLAY_EVENT} labelledBy="termin-titel">
        {(schliessen) => <TerminKalender onClose={schliessen} />}
      </Overlay>
      <Overlay hash={WORKSHOP_HASH} eventName={WORKSHOP_OVERLAY_EVENT} labelledBy="workshop-titel">
        {(schliessen) => <WorkshopBuchung onClose={schliessen} />}
      </Overlay>
    </>
  )
}
