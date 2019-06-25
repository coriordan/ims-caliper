/*
 * This file is part of IMS Caliper Analytics™ and is licensed to
 * IMS Global Learning Consortium, Inc. (http://www.imsglobal.org)
 * under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information.
 *
 * IMS Caliper is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * IMS Caliper is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

var _ = require('lodash');
var moment = require('moment');
var test = require('tape');

var config =  require('../../lib/config/config');
var entityFactory = require('../../lib/entities/entityFactory');
var Chapter = require('../../lib/entities/resource/chapter');
var Document = require('../../lib/entities/resource/document');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEntityChapter.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('chapterTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_IRI = "https://example.com";

    var parent = entityFactory().create(Document, {
      id: BASE_IRI.concat("/#/texts/imscaliperimplguide"),
      name: "IMS Caliper Implementation Guide",
      dateCreated: moment.utc("2016-10-01T06:00:00.000Z"),
      version: "1.1"
    });

    var entity = entityFactory().create(Chapter, {
      id: BASE_IRI.concat("/#/texts/imscaliperimplguide/cfi/6/10"),
      name: "The Caliper Information Model",
      isPartOf: parent
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});