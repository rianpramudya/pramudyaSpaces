import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SculptureStage} from '../src/components/sculpture-stage';
test('scene starts with a visible static hero fallback and contact keeps manual controls',()=>{
 for(const variant of ['hero','contact'] as const){const html=renderToStaticMarkup(React.createElement(SculptureStage,{variant,en:false}));assert.ok(html.includes('data-renderer="fallback"'));assert.ok(html.includes('<canvas'));assert.ok(html.includes('sculpture-fallback'));assert.ok(html.includes('Putar objek'));}
});
