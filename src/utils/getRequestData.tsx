import { gql, request } from "graphql-request";

const url =
  "https://api.studio.thegraph.com/query/103742/committestgroan/version/latest";

const SEARCH_QUERY_1 = gql`
  {
    assigns(first: 5) {
      id
      to
      punkIndex
      blockNumber
    }
    transfers(first: 5) {
      id
      from
      to
      value
    }
  }
`;
const SEARCH_QUERY_2 = gql`INSERT QUERY HERE`;

export async function fetchAllData(): Promise<any> {
  try {
    const response = await request(url, SEARCH_QUERY_1);
    if (!response) {
      throw new Error("Data not found");
    }
    return response;
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    throw error;
  }
}

export async function fetchUserData(searchQuery: string): Promise<any> {
  // Return empty
  if (!searchQuery) {
    console.warn("fetchData: searchQuery is empty, returning null");
    return null;
  }

  try {
    const response = await request(url, SEARCH_QUERY_2, {
      search: searchQuery,
    });
    if (!response) {
      throw new Error("Data not found");
    }
    return response;
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    throw error;
  }
}
