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
var SessionEvent = require('../../lib/events/sessionEvent');
var actions = require('../../lib/actions/actions');

var entityFactory = require('../../lib/entities/entityFactory');
var Person = require('../../lib/entities/agent/person');
var Session = require('../../lib/entities/session/session');
var SoftwareApplication = require('../../lib/entities/agent/softwareApplication');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEventSessionLoggedOut.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('sessionEventLoggedOutTest', function(t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_IRI = "https://example.edu";

    // Id with canned value
    uuid = "urn:uuid:a438f8ac-1da3-4d48-8c86-94a1b387e0f6";

    // The Actor
    var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

    // The Action
    var action = actions.loggedOut.term;

    // The Object of the interaction
    var obj = entityFactory().create(SoftwareApplication, {id: BASE_IRI, version: "v2"});

    // Event time
    var eventTime = moment.utc("2016-11-15T11:05:00.000Z");

    // edApp
    var edApp = obj.id;

    // Session
    var session = entityFactory().create(Session, {
      id: BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259"),
      user: actor.id,
      dateCreated: moment.utc("2016-11-15T10:00:00.000Z"),
      startedAtTime: moment.utc("2016-11-15T10:00:00.000Z"),
      endedAtTime: moment.utc("2016-11-15T11:05:00.000Z"),
      duration: "PT3000S"
    });

    // Assert that key attributes are the same
    var event = eventFactory().create(SessionEvent, {
      id: uuid,
      actor: actor,
      action: action,
      object: obj,
      eventTime: eventTime,
      edApp: edApp,
      session: session
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(event));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});