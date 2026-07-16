# Cahier des Charges - Tableau de Risques de Contamination de Maladies de la Vigne

## 1. Vue d'ensemble du projet

### 1.1 Objectif général
Développer une application web interactive affichant un **tableau de risque de contamination des maladies de la vigne** basé sur plusieurs modèles de calcul épidémiologiques. L'application doit être intégrée dans un Experience Builder dans ArcGIS Online.

### 1.2 Contexte
L'Institut Français de la Vigne et du Vin (IFV) a besoin d'une solution pour visualiser et communiquer les risques de propagation des maladies viticoles aux viticulteurs et aux décideurs.

### 1.3 Public cible
- Viticulteurs
- Conseillers agricoles
- Décideurs en viticulture
- Chercheurs en épidémiologie végétale

---

## 2. Fonctionnalités principales

### 2.1 Tableau de risques
**Description** : Afficher un tableau présentant les risques de contamination pour différentes maladies de la vigne

**Spécifications** :
- Afficher les données organisées en colonnes :
  - Nom de la maladie
  - Modèle(s) de calcul utilisé(s)
  - Niveau de risque (Faible, Moyen, Élevé, Très Élevé) avec code couleur
  - Probabilité de contamination (%)
  - Facteurs climatiques influençant le risque
  - Date de mise à jour
  
- Capacités de tri et filtrage :
  - Trier par niveau de risque
  - Filtrer par maladies
  - Filtrer par modèle de calcul
  - Filtrer par plage de probabilité

- Indicateurs visuels :
  - Code couleur : Vert (faible), Jaune (moyen), Orange (élevé), Rouge (très élevé)
  - Icônes représentant les maladies
  - Barres de progression pour visualiser la probabilité

### 2.2 Comparaison des modèles
**Description** : Permettre la comparaison des résultats entre différents modèles de calcul

**Spécifications** :
- Afficher une vue comparée des résultats pour une même maladie
- Afficher les écarts entre les modèles
- Présenter la confiance/fiabilité de chaque modèle
- Historique des prévisions (5 derniers jours)

### 2.3 Détails et contexte
**Description** : Fournir des informations contextuelles sur chaque résultat

**Spécifications** :
- Décrire les facteurs climatiques utilisés dans le calcul
- Expliquer la méthodologie du modèle
- Afficher la source des données météorologiques
- Fournir des recommandations d'action basées sur le risque

### 2.4 Responsivité
**Description** : L'application doit fonctionner sur tous les appareils

**Spécifications** :
- Desktop (1920x1080 et plus)
- Tablette (768px et plus)
- Mobile (320px et plus)
- Adaptation des tableaux pour petits écrans (horizontal scroll ou collapsible)

---

## 3. Données et modèles

### 3.1 Structure des données

```json
{
  "id": "uuid",
  "diseaseName": "Mildiou",
  "riskLevel": "HIGH",
  "probability": 75,
  "models": [
    {
      "name": "DMLA",
      "probability": 75,
      "reliability": 0.92,
      "lastUpdate": "2024-01-15T10:00:00Z"
    },
    {
      "name": "Smith",
      "probability": 68,
      "reliability": 0.88,
      "lastUpdate": "2024-01-15T10:00:00Z"
    }
  ],
  "climaticFactors": {
    "temperature": 18,
    "humidity": 85,
    "rainfall": 2.5
  },
  "recommendations": "Augmenter la fréquence des traitements préventifs",
  "lastUpdate": "2024-01-15T10:00:00Z"
}
```

### 3.2 Modèles supportés
- **DMLA** : Downy Mildew Level Alert
- **Smith** : Modèle Smith classique
- **RIM** : Risk Infection Model
- **Custom** : Modèles personnalisés (extensible)

### 3.3 Sources de données
- API météorologiques (à définir avec le client)
- Données d'observations terrain
- Résultats de calculs des modèles épidémiologiques

---

## 4. Intégration ArcGIS

### 4.1 Format d'intégration
L'application doit être intégrée comme **Web AppBuilder widget** ou **Experience Builder element** dans ArcGIS Online

### 4.2 Spécifications techniques
- Exporter les données en format GeoJSON avec localisation
- Supporter les événements de sélection dans ArcGIS
- Activer la synchronisation avec une couche de carte ArcGIS
- Format d'export : CSV, GeoJSON, PDF

### 4.3 Authentification
- Supporter l'authentification ArcGIS OAuth 2.0
- Gérer les permissions d'accès par utilisateur/groupe

---

## 5. Performances et qualité

### 5.1 Objectifs de performance
- Chargement initial : < 3 secondes
- Interaction avec le tableau : < 500ms
- Actualisation des données : max 30 secondes

### 5.2 Accessibilité
- Conformité WCAG 2.1 AA
- Support des lecteurs d'écran
- Navigation au clavier complète
- Contraste suffisant (ratio 4.5:1)

### 5.3 Navigateurs supportés
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 6. Livrables

### 6.1 Code et documentation
1. **Repository GitHub** avec code source complet
2. **Documentation API** (OpenAPI/Swagger si API backend)
3. **Guide de déploiement**
4. **Guide d'intégration ArcGIS**
5. **Guide d'utilisation utilisateur**
6. **Architecture technique**
7. **Guidelines de développement**

### 6.2 Application
1. **Build de production** optimisée
2. **Application web standalone** (pour test)
3. **Composant d'intégration** pour ArcGIS Experience Builder

### 6.3 Tests et qualité
1. **Suite de tests unitaires** (coverage > 80%)
2. **Tests d'intégration**
3. **Tests d'accessibilité**
4. **Rapport de performance**
5. **Audit de sécurité**

### 6.4 Formation
1. **Documentation technique** pour les développeurs
2. **Guide d'utilisation** pour les utilisateurs finaux
3. **Session de démonstration**

---

## 7. Dépendances externes

### 7.1 Services requis
- **API météorologiques** (à définir)
- **API de calcul des modèles** (à développer ou intégrer)
- **ArcGIS Online** (compte requis)
- **Base de données** pour historique (optionnel)

### 7.2 Frameworks et librairies
- **Frontend** : React 18+, TypeScript, Vite
- **UI** : Shadcn/UI, Tailwind CSS
- **Data** : TanStack React Table, React Query
- **État** : Zustand
- **Visualisation** : Recharts ou Chart.js
- **Tests** : Vitest, React Testing Library
- **ArcGIS** : ArcGIS API for JavaScript

---

## 8. Contraintes et hypothèses

### 8.1 Contraintes
- Budget limité (solution open source preferée)
- Équipe junior en développement
- Délai : à définir avec le client
- Infrastructure : hébergement à définir

### 8.2 Hypothèses
- Les données des modèles sont disponibles via API
- Données mises à jour au minimum quotidiennement
- Max 50 maladies simultanément
- Max 10 modèles différents

---

## 9. Jalons et planning

| Phase | Description | Durée estimée |
|-------|-------------|----------------|
| Phase 1 | Setup initial, architecture | 1 semaine |
| Phase 2 | Développement tableau de base | 2 semaines |
| Phase 3 | Filtrage, tri, comparaison | 1.5 semaines |
| Phase 4 | Intégration ArcGIS | 1 semaine |
| Phase 5 | Tests et optimisation | 1.5 semaines |
| Phase 6 | Déploiement et documentation | 1 semaine |

**Durée totale estimée : 8 semaines**

---

## 10. Critères d'acceptation

- [ ] Tableau affiche les données sans erreur
- [ ] Filtres et tri fonctionnent correctement
- [ ] Responsive sur tous les appareils
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Performance < 3s chargement
- [ ] Intégration ArcGIS fonctionnelle
- [ ] Tests > 80% de coverage
- [ ] Documentation complète
- [ ] Zéro fuite mémoire détectée
- [ ] Code review approuvé
