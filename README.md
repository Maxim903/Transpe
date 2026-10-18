# TranspaTech

Tableau de bord Next.js pour explorer les rapports de transparence des GAFAM à l'aide de Recharts.

Les pages Amazon, Apple, Google, Meta et Microsoft sont accessibles depuis le sélecteur de
l’éditeur dans le fil d’Ariane. Les données Microsoft proviennent du fichier LERR existant ;
les quatre autres éditeurs utilisent des fichiers de démonstration dont les valeurs sont
fictives et doivent être remplacées avant toute publication ou analyse réelle.
La vue CLOUD Act, accessible depuis la barre latérale, utilise des CSV séparés par éditeur.
Tous ses chiffres sont actuellement fictifs et doivent être remplacés par des sources vérifiées.
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

Les tableaux de bord lisent les fichiers suivants côté serveur :

- `demande d'accord acces au données/normalise/Microsoft_LERR_Master_All.csv` (source Microsoft existante)
- `demande d'accord acces au données/normalise/Amazon_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Apple_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Google_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Meta_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Amazon_CLOUD_Act_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Apple_CLOUD_Act_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Google_CLOUD_Act_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Meta_CLOUD_Act_SIMULATION.csv`
- `demande d'accord acces au données/normalise/Microsoft_CLOUD_Act_SIMULATION.csv`

Les fichiers de démonstration contiennent uniquement des chiffres fictifs. Pour les remplacer,
gardez le chemin et le nom du CSV ainsi que les colonnes `Country`, `Total_Requests`,
`Accounts_Specified`, `Service_Or_Type`, `Source_File` et `Year_Period`. Après vérification
des sources, changez `dataStatus: "simulation"` en `dataStatus: "real"` pour l’éditeur
correspondant dans `app/lib/editors.ts` afin que l’interface et les PDF retirent l’avertissement.
Pour les fichiers CLOUD Act, conservez le chemin et les colonnes, puis passez le
`cloudActStatus` de l’éditeur concerné de `"simulation"` à `"real"`. Ce statut est indépendant
du `dataStatus` des rapports habituels de l’éditeur.

Les périodes semestrielles sont reconstituées à partir du nom de fichier source ; les lignes
de total et les copies identiques d'une même donnée sont ignorées lors du calcul des graphiques.
