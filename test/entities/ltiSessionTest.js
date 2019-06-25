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
var Person = require('../../lib/entities/agent/person');
var LtiSession = require('../../lib/entities/session/ltiSession');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEntityLtiSession.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('ltiSessionTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_COM_IRI = "https://example.com";
    const BASE_EDU_IRI = "https://example.edu";

    // LTI-related message parameters
    var messageParameters = {
      lti_message_type: "basic-lti-launch-request",
      lti_version: "LTI-2p0",
      context_id: "4f1a161f-59c3-43e5-be37-445ad09e3f76",
      context_type: "CourseSection",
      resource_link_id: "6b37a950-42c9-4117-8f4f-03e6e5c88d24",
      roles: [ "Learner" ],
      user_id: "0ae836b9-7fc9-4060-006f-27b2066ac545",
      custom: {
        caliper_profile_url: "https://example.edu/lti/tc/cps",
        caliper_session_id: "1c519ff7-3dfa-4764-be48-d2fb35a2925a",
        tool_consumer_instance_url: "https://example.edu"
      },
      ext: {
        edu_example_course_section: "https://example.edu/terms/201601/courses/7/sections/1",
        edu_example_course_section_roster: "https://example.edu/terms/201601/courses/7/sections/1/rosters/1",
        edu_example_course_section_learner: "https://example.edu/users/554433",
        edu_example_course_section_instructor: "https://example.edu/faculty/1234"
      }
    };

    var actor = entityFactory().create(Person, {id: BASE_EDU_IRI.concat("/users/554433")});

    var entity = entityFactory().create(LtiSession, {
      id: BASE_COM_IRI.concat("/sessions/b533eb02823f31024e6b7f53436c42fb99b31241"),
      user: actor,
      messageParameters: messageParameters,
      dateCreated: moment.utc("2016-11-15T10:15:00.000Z"),
      startedAtTime: moment.utc("2016-11-15T10:15:00.000Z")
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});