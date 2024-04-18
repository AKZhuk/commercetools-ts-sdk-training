import { log } from "./utils/logger";
import { apiRoot } from "./handson/client";

// TODO: Complete the functions in
// ./handson/client.ts

// So this code displays the project configuration
// https://docs.commercetools.com/api/projects/project#get-project

// TODO: Get project settings
const getProject = () => {
  return apiRoot
    .get()
    .execute();
};

// Retrieve Project information and output the result to the log


// TODO: Get shipping method by id
const getShippingMethodById = (key: string) => {
  return apiRoot.shippingMethods().withKey({ key }).get().execute()
}
// TODO: Get standard tax category by key
const getTaxCategoryByKey = (key: string) => {
  return apiRoot.taxCategories().withKey({ key }).get().execute()
}

// getProject()
// getShippingMethodById('us-delivery')
//getTaxCategoryByKey('standard-tax')