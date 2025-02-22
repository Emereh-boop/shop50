{
  "indexes": [
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "title",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "weight",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "inStock",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "price",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
