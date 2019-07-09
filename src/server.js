import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import exphbs  from 'express-handlebars';

import Html from './components/Html';
import App from './components/App';

const app = express();

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname));
app.use(express.static(path.join(__dirname)));

app.get('*', async (req, res) => {
  const initialState = { initialText: "rendered on the serve2rs" };

  const pageHtml = ReactDOMServer.renderToString(<App initialState={initialState} />);
  //const pageHtml = ReactDOMServer.renderToStaticMarkup(<Html children={appMarkup} scripts={scripts} initialState={initialState} />);


  res.render('./views/main-page.handlebars', { content: pageHtml, initialState: JSON.stringify(initialState), layout: false });

});

app.listen(3000, () => console.log('Listening on localhost:3000'));
