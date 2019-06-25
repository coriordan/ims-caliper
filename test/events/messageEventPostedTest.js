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
var MessageEvent = require('../../lib/events/messageEvent');
var actions = require('../../lib/actions/actions');

var entityFactory = require('../../lib/entities/entityFactory');
var CourseSection = require('../../lib/entities/agent/courseSection');
var Forum = require('../../lib/entities/resource/forum');
var Membership = require('../../lib/entities/agent/membership');
var Message = require('../../lib/entities/resource/message');
var Person = require('../../lib/entities/agent/person');
var Role = require('../../lib/entities/agent/role');
var SoftwareApplication = require('../../lib/entities/agent/softwareApplication');
var Session = require('../../lib/entities/session/session');
var Thread = require('../../lib/entities/resource/thread');
var Status = require('../../lib/entities/agent/status');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEventMessagePosted.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('messageEventPostedTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_IRI = "https://example.edu";
    const BASE_SECTION_IRI = "https://example.edu/terms/201601/courses/7/sections/1";
    const BASE_FORUM_IRI = "https://example.edu/terms/201601/courses/7/sections/1/forums/2";
    const BASE_THREAD_IRI = "https://example.edu/terms/201601/courses/7/sections/1/forums/2/topics/1";

    // Id with canned value
    uuid = "urn:uuid:0d015a85-abf5-49ee-abb1-46dbd57fe64e";

    // Actor
    var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

    // Action
    var action = actions.posted.term;

    // Forum, Thread context
    var forum = entityFactory().create(Forum, {id: BASE_FORUM_IRI, name: "Caliper Forum" });
    var thread = entityFactory().create(Thread, {id: BASE_THREAD_IRI, name: "Caliper Adoption", isPartOf: forum});

    // Message creators
    var creators = [];
    creators.push(actor);

    // The Object of the interaction
    var obj = entityFactory().create(Message, {
      id: BASE_THREAD_IRI.concat("/messages/2"),
      creators: creators,
      body: "Are the Caliper Sensor reference implementations production-ready?",
      isPartOf: thread,
      dateCreated: moment.utc("2016-11-15T10:15:00.000Z")
    });

    // Event time
    var eventTime = moment.utc("2016-11-15T10:15:00.000Z");

    // edApp context
    var edApp = entityFactory().create(SoftwareApplication, {id: BASE_IRI.concat("/forums"), version: "v2"});

    // Group
    var group = entityFactory().create(CourseSection, {
      id: BASE_SECTION_IRI,
      courseNumber: "CPS 435-01",
      academicSession: "Fall 2016"
    });

    // Membership
    var membership = entityFactory().create(Membership, {
      id: BASE_SECTION_IRI.concat("/rosters/1"),
      member: actor.id,
      organization: group.id,
      roles: [Role.learner.term],
      status: Status.active.term,
      dateCreated: moment.utc("2016-08-01T06:00:00.000Z")
    });

    // Session
    var session = entityFactory().create(Session, {
      id: BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259"),
      startedAtTime: moment.utc("2016-11-15T10:00:00.000Z")
    });

    // Assert that key attributes are the same
    var event = eventFactory().create(MessageEvent, {
      id: uuid,
      actor: actor,
      action: action,
      object: obj,
      eventTime: eventTime,
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