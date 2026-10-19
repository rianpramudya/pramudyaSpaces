import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {DepthSurface} from '../src/components/depth-surface';
test('depth surfaces retain native semantics, readable content and functional children before enhancement',()=>{
 const html=renderToStaticMarkup(React.createElement(DepthSurface,{as:'article',className:'timeline-row',room:'journey'},React.createElement('a',{href:'/projects/a'},'Actual CMS contribution')));
 assert.ok(html.startsWith('<article'));assert.ok(html.includes('timeline-row'));assert.ok(html.includes('data-room="journey"'));assert.ok(html.includes('href="/projects/a"'));assert.ok(html.includes('Actual CMS contribution'));assert.ok(!html.includes('tabindex'));
});
