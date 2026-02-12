export const CustomerService = {
  getCustomersMedium() {
    return fetch("/data/customers-medium.json")
      .then((res) => res.json())
      .then((data) => data.data);
  },
};
