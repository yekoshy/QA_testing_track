import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();

test.describe('BasicStore_APITesting', () => {
  
  // Set the base URL for this entire block, making the requests much cleaner
  test.use({ baseURL: 'https://testpages.eviltester.com' });

  test('Product Count', async ({ request }) => {
    // 1. Send the Request
    const response = await request.get('/api/basicstore/products/count', {
      headers: {
        'accept': 'application/json'
      }
    });

    // 2. Postman: pm.test("Status code is 200")
    expect(response.status()).toBe(200);

    // 3. Postman: pm.test("Check Product")
    const jsonData = await response.json();
    expect(jsonData).toEqual(100);
  });

  test('Get 10 Products', async ({ request }) => {
    // 1. Send the Request (Query parameters are passed cleanly in the `params` object)
    const response = await request.get('/api/basicstore/products', {
      params: {
        from: 0,
        to: 10,
        limit: 10
      }
    });

    // 2. Postman: pm.test("Status code is 200")
    expect(response.status()).toBe(200);

    // 3. Postman: pm.test("Response body is valid JSON schema")
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          price: { type: "number" },
          title: { type: "string" },
          description: { type: "string" },
          stockLevel: { type: "integer" },
          thumbnail: { type: "string" }
        },
        additionalProperties: false, 
        required: [
          "id",
          "price",
          "title",
          "description",
          "stockLevel",
          "thumbnail"
        ]
      }
    };

    const jsonData = await response.json();
    
    // Compile and validate the schema
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);

    // Expect 'valid' to be true. If it fails, output the specific schema validation errors.
    expect(valid, `Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`).toBe(true);
  });

  test('Get Product with not found ID', async ({ request }) => {
    // 1. Send the Request
    const response = await request.get('/api/basicstore/products/1000');

    // 2. Postman: pm.test("Status code is 404")
    expect(response.status()).toBe(404);

    // 3. Postman: pm.test("Verify Error Message")
    const jsonData = await response.json();
    expect(jsonData.errors).toEqual("Product with id 1000 not found");
  });

});