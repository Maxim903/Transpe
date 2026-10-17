# Transpa

Tableau de bord Next.js pour explorer les rapports Microsoft LERR à l'aide de Recharts.

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
