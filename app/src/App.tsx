import { useRoute } from './lib/router'
import { RewardToast } from './components/UI'
import { Splash } from './screens/Splash'
import { Intro } from './screens/Intro'
import { Home } from './screens/Home'
import { MapScreen } from './screens/MapScreen'
import { Missions } from './screens/Missions'
import { MissionDetail } from './screens/MissionDetail'
import { PlaceCard, Places } from './screens/Places'
import { Secret } from './screens/Secret'
import { Ranks, Treasury } from './screens/Treasury'
import { Boss } from './screens/Boss'
import { Gallery } from './screens/Gallery'
import { Finale } from './screens/Finale'
import { Certificate } from './screens/Certificate'
import { Parent } from './screens/Parent'

function Screen() {
  const [page, arg] = useRoute()
  switch (page) {
    case 'pribeh': return <Intro />
    case 'domov': return <Home />
    case 'mapa': return <MapScreen />
    case 'mise': return <Missions key={arg ?? 'all'} world={arg} />
    case 'mise-detail': return <MissionDetail id={arg} />
    case 'mista': return <Places />
    case 'misto': return <PlaceCard key={arg} id={arg} />
    case 'tajemstvi': return <Secret key={arg} id={arg} />
    case 'pokladnice': return <Treasury />
    case 'hodnosti': return <Ranks />
    case 'boss': return <Boss />
    case 'galerie': return <Gallery />
    case 'finale': return <Finale />
    case 'certifikat': return <Certificate />
    case 'rodice': return <Parent />
    default: return <Splash />
  }
}

export function App() {
  return (
    <div className="phone">
      <Screen />
      <RewardToast />
    </div>
  )
}
