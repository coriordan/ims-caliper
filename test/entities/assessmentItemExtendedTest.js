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
var Assessment = require('../../lib/entities/resource/assessment');
var AssessmentItem = require('../../lib/entities/resource/assessmentItem');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEntityAssessmentItemExtended.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('assessmentItemExtendedTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_ASSESS_IRI = "https://example.edu/terms/201601/courses/7/sections/1/assess/1";

    var parent = entityFactory().create(Assessment, {id: BASE_ASSESS_IRI});

    // Custom extension
    var extensions = {
      "questionType": "Dichotomous",
      "questionText": "Is a Caliper SoftwareApplication a subtype of Caliper Agent?",
      "correctResponse": "yes"
    };

    var entity = entityFactory().create(AssessmentItem, {
      id: BASE_ASSESS_IRI.concat("/items/3"),
      isPartOf: parent,
      dateCreated: moment.utc("2016-08-01T06:00:00.000Z"),
      datePublished: moment.utc("2016-08-15T09:30:00.000Z"),
      maxSubmits: 2,
      maxScore: 1,
      isTimeDependent: false,
      extensions: extensions
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});