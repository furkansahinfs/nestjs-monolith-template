import {
  ClientResponse,
  Customer,
  CustomerDraft,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  CustomerUpdateAction,
} from "@commercetools/platform-sdk";

type FindCustomersParam = {
  where?: string;
  limit?: number;
  offset?: number;
};

export interface CTCustomerSDK {
  findCustomers({
    where,
    limit,
    offset,
  }: FindCustomersParam): Promise<ClientResponse<CustomerPagedQueryResponse>>;
  findCustomerById(customerId: string): Promise<Customer>;
  findCustomerByCustomerNumber(customerNumber: string): Promise<Customer>;
  createCustomer(
    customerDraft: CustomerDraft,
  ): Promise<ClientResponse<CustomerSignInResult>>;
  updateCustomer(
    customerId: string,
    customerUpdateActions: CustomerUpdateAction[],
  ): Promise<ClientResponse<Customer>>;
}
