curl -kv \
-X PATCH \
-H "Authorization: Bearer $TOKEN" \
-d '{"name": "Test Ites","dueDate": "2021-05-19", "done": true}' \
http://localhost:3000/dev/item/5986741c-ed6d-4b5c-8add-4fcfa5862980