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

var config = require('../../lib/config/config');
var eventFactory = require('../../lib/events/eventFactory');
var validator = require('../../lib/validators/validator');
var NavigationEvent = require('../../lib/events/navigationEvent');
var actions = require('../../lib/actions/actions');

var entityFactory = require('../../lib/entities/entityFactory');
var CourseSection = require('../../lib/entities/agent/courseSection');
var Membership = require('../../lib/entities/agent/membership');
var Person = require('../../lib/entities/agent/person');
var Role = require('../../lib/entities/agent/role');
var Session = require('../../lib/entities/session/session');
var SoftwareApplication = require('../../lib/entities/agent/softwareApplication');
var WebPage = require('../../lib/entities/resource/webPage');
var Status = require('../../lib/entities/agent/status');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEventNavigationNavigatedToThinned.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('navigationEventNavigatedToThinnedTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_IRI = "https://example.edu";
    const BASE_SECTION_IRI = "https://example.edu/terms/201601/courses/7/sections/1";

    // Id with canned value
    uuid = "urn:uuid:71657137-8e6e-44f8-8499-e1c3df6810d2";

    // The Actor
    var actor = entityFactory().coerce(Person, {id: BASE_IRI.concat("/users/554433")});

    // The Action
    var action = actions.navigatedTo.term;

    // The Object of the interaction
    var obj = entityFactory().coerce(WebPage, {id: BASE_SECTION_IRI.concat("/pages/2")});

    // Event time
    var eventTime = moment.utc("2016-11-15T10:15:00.000Z");

    // Referring resource
    var referrer = entityFactory().coerce(WebPage, {id: BASE_SECTION_IRI.concat("/pages/1")});

    // The edApp
    var edApp = entityFactory().coerce(SoftwareApplication, {id: BASE_IRI});

    // Group
    var group = entityFactory().coerce(CourseSection, {id: BASE_SECTION_IRI});

    // The Actor's Membership
    var membership = entityFactory().coerce(Membership, {id: BASE_SECTION_IRI.concat("/rosters/1")});

    // Session
    var session = entityFactory().coerce(Session, {id: BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259")});

    // Assert that key attributes are the same
    var event = eventFactory().create(NavigationEvent, {
      id: uuid,
      actor: actor,
      action: action,
      object: obj,
      eventTime: eventTime,
      referrer: referrer,
      edApp: edApp,
      group: group,
      membership: membership,
      session: session
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(event));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});