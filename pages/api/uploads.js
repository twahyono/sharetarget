const formidable = require('formidable');
const uploads = (req, res) => {
  //res.status(200).json({ name: 'John Doe' })
    console.log("request to upload files")
    const form = formidable({ multiples: true });
 
    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });
  }

export default uploads;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};