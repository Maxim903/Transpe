# TranspaTech

Tableau de bord Next.js pour explorer les rapports de transparence des GAFAM à l'aide de Recharts.

Les pages Amazon, Apple, Google, Meta et Microsoft sont accessibles depuis le sélecteur de
l’éditeur dans le fil d’Ariane. Seules les données Microsoft LERR sont actuellement intégrées ;
les autres pages indiquent explicitement que leurs données ne sont pas encore disponibles.
Depuis le tableau de bord Microsoft, un rapport PDF personnalisé peut être téléchargé après
avoir rempli le formulaire. Les coordonnées saisies restent dans le navigateur et ne sont
pas conservées.

Le pied de page commun donne accès aux mentions légales, à la politique de confidentialité,
aux informations sur les cookies et aux conditions d’utilisation et sources. Pour publier
une adresse de contact sans exposer une adresse personnelle, configurez `LEGAL_CONTACT_EMAIL`
comme variable d’environnement dans Vercel puis redéployez. La page des mentions légales
explique également les vérifications nécessaires pour un éditeur particulier souhaitant
préserver son anonymat.

## Lancer le site

Installez Node.js 20.9 ou une version ultérieure, puis exécutez à la racine du projet :

```bash
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

## Fichier de données

Le tableau de bord lit le fichier suivant côté serveur :

`demande d'accord acces au données/normalise/Microsoft_LERR_Master_All.csv`

Ce fichier doit donc être présent au lancement du site. Les périodes semestrielles sont
reconstituées à partir du nom du fichier source ; les lignes de total et les copies
identiques d'une même donnée sont ignorées lors du calcul des graphiques.
