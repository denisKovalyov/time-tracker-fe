type Props = {
  url: string;
  method?: string;
  args?: string[] | number[] | Object;
}

export default (apiUrl: string) => async ({ url, method = 'POST', args }: Props): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ args }),
    });
    if (response.status === 200) {
      return response.json();
    } else {
      console.error(`Status Code: ${response.status}`);
    }
  } catch (e) {
    console.error(e);
  }
};
