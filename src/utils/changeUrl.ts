export const replaceLocalhost = (url: string): string => {
  if (!url) {
    //console.log('Add Image Later');
    return "http://addimagesourcelater:8888";
  }
  return url.replace("http://localhost:8888", "http://10.0.2.2:8888");
};
// I know this utility function is little bit corny but I had no other options because the backend service was not in my control.
