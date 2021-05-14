curl -kv \
-X POST \
-H "Authorization: Bearer $TOKEN" \
-d '{"name": "Test Ites","dueDate": "2021-05-19"}' \
http://localhost:3000/dev/item