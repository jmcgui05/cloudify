async function hello(event) {
  console.log(JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: "Hello from lambda"
  }
}

module.exports = {
  hello
}