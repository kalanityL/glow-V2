import {
  IconeActivite,
  IconeBalance,
  IconeComprime,
  IconeEffetsSecondaires,
  IconeMarche,
  IconeRepas,
  IconeSeringue,
  IconeSommeil,
  IconeTempsPourSoi,
} from '../components/Icones';
import type { Forme } from '../domaine/traitements';
import type { ModuleId } from '../app/modules';

/** L'icône de chaque module — sauf le traitement, qui suit la forme répondue. */
const ICONES_MODULES: Record<Exclude<ModuleId, 'traitement'>, React.ReactNode> = {
  balance: <IconeBalance />,
  'effets-secondaires': <IconeEffetsSecondaires />,
  menus: <IconeRepas />,
  marche: <IconeMarche />,
  'activite-physique': <IconeActivite />,
  sommeil: <IconeSommeil />,
  'temps-pour-soi': <IconeTempsPourSoi />,
};

/**
 * L'ICÔNE D'UN MODULE, la même partout où un module se montre (l'accueil, le
 * tiroir du « + ») : le traitement montre le comprimé si la forme répondue
 * est « comprimé », la seringue sinon — comme la V1.
 */
export function IconeDuModule({ module, forme }: { module: ModuleId; forme: Forme | null }) {
  if (module === 'traitement') return forme === 'comprime' ? <IconeComprime /> : <IconeSeringue />;
  return <>{ICONES_MODULES[module]}</>;
}
