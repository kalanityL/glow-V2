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
/* SES HUIT ICÔNES EN RELIEF (2026-09-26, « uniquement pour la home, utilise
   les icones dans ../images pour claude/template/icones pour le bas de la
   home ») : des FICHIERS embarqués, comme les polices, les photos et les
   sons — jamais une ressource distante. Découpés de ses captures par
   `scripts/decouper-icones-modules.py`, à relancer si elle en dépose
   d'autres. */
import imageTraitementInjection from '../assets/images/modules/traitement-injection.png';
import imageBalance from '../assets/images/modules/balance.png';
import imageEffetsSecondaires from '../assets/images/modules/effets-secondaires.png';
import imageMenus from '../assets/images/modules/menus.png';
import imageMarche from '../assets/images/modules/marche.png';
import imageActivite from '../assets/images/modules/activite-physique.png';
import imageSommeil from '../assets/images/modules/sommeil.png';
import imageTempsPourSoi from '../assets/images/modules/temps-pour-soi.png';

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

/** L'image de chaque module, hors traitement — qui suit la forme. */
const IMAGES_MODULES: Record<Exclude<ModuleId, 'traitement'>, string> = {
  balance: imageBalance,
  'effets-secondaires': imageEffetsSecondaires,
  menus: imageMenus,
  marche: imageMarche,
  'activite-physique': imageActivite,
  sommeil: imageSommeil,
  'temps-pour-soi': imageTempsPourSoi,
};

/**
 * L'ICÔNE D'UN MODULE POUR LE BAS DE LA HOME, ET LÀ SEULEMENT (2026-09-26,
 * « uniquement pour la home, utilise les icones dans ../images pour
 * claude/template/icones pour le bas de la home ») : ses dessins en relief,
 * embarqués en PNG détourés. LEURS COULEURS SONT CELLES DE SES IMAGES, pas
 * celles du thème — exception consignée, comme la coche de validation d'une
 * confirmation : ces dessins ont leurs dégradés et leur volume, qu'un aplat
 * de thème détruirait. Partout ailleurs — le journal, le tiroir du « + »,
 * le filtre, la confirmation —, c'est `IconeDuModule`, au trait, qui sert.
 *
 * SOUS FORME ORALE, LE TRAITEMENT GARDE SON DESSIN AU TRAIT : elle n'a donné
 * que la seringue, et montrer une seringue à qui prend un comprimé serait
 * faux. Le jour où elle donne l'image du comprimé, elle s'ajoute ici.
 */
export function ImageDuModule({ module, forme }: { module: ModuleId; forme: Forme | null }) {
  const source = module === 'traitement' ? (forme === 'comprime' ? null : imageTraitementInjection) : IMAGES_MODULES[module];
  if (!source) return <IconeDuModule module={module} forme={forme} />;
  return <img className="module__image" src={source} alt="" />;
}
