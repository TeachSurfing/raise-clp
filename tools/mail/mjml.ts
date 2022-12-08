import fs from 'fs';
import mjml from 'mjml';
import path from 'path';

const mjmlFolder = path.join(
  __dirname,
  '../../apps/clp-api/src/app/mail/templates/mjml'
);

fs.readdir(mjmlFolder, (err, files) => {
  if (err) {
    return console.error(err);
  }
  let hbs;
  let fileContent;

  files.forEach((file) => {
    console.warn('Template: ' + file);
    fileContent = fs.readFileSync(
      path.join(
        __dirname,
        '../../apps/clp-api/src/app/mail/templates/mjml',
        file
      )
    );
    fileContent = mjml(fileContent.toString());
    hbs = path.join(
      __dirname,
      '../../apps/clp-api/src/app/mail/templates/hbs/' +
        file.replace('.mjml', '.hbs')
    );
    fs.writeFileSync(hbs, fileContent.html);
  });
});
