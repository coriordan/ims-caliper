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
var Document = require('../../lib/entities/resource/document');
var Forum = require('../../lib/entities/resource/forum');
var Message = require('../../lib/entities/resource/message');
var Person = require('../../lib/entities/agent/person');
var Thread = require('../../lib/entities/resource/thread');
var clientUtils = require('../../lib/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEntityMessage.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('messageTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_IRI = "https://example.edu";
    const BASE_FORUM_IRI = "https://example.edu/terms/201601/courses/7/sections/1/forums/2";
    const BASE_THREAD_IRI = "https://example.edu/terms/201601/courses/7/sections/1/forums/2/topics/1";

    // Forum, Thread context
    var forum = entityFactory().create(Forum, {id: BASE_FORUM_IRI});
    var thread = entityFactory().create(Thread, {id: BASE_THREAD_IRI, isPartOf: forum});

    // Message creators
    var creators = [];
    creators.push(entityFactory().create(Person, {id: BASE_IRI.concat("/users/778899")}));

    // replyTo
    var replyTo = entityFactory().create(Message, {id: BASE_THREAD_IRI.concat("/messages/2")});

    // Attachments
    var attachments = [];
    attachments.push(entityFactory().create(Document, {
      id: BASE_IRI.concat("/etexts/201.epub"),
      name: "IMS Caliper Implementation Guide",
      dateCreated: "2016-10-01T06:00:00.000Z",
      version: "1.1"
    }));

    // Message
    var entity = entityFactory().create(Message, {
      id: BASE_THREAD_IRI.concat("/messages/3"),
      creators: creators,
      body: "The Caliper working group provides a set of Caliper Sensor reference implementations for the purposes of education and experimentation.  They have not been tested for use in a production environment.  See the Caliper Implementation Guide for more details.",
      replyTo: replyTo,
      isPartOf: thread,
      attachments: attachments,
      dateCreated: moment.utc("2016-11-15T10:15:30.000Z")
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});