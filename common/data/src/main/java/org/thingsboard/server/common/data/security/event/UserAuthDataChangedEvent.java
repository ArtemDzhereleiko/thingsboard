/**
 * Copyright © 2016-2022 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.server.common.data.security.event;

import lombok.Data;
import org.thingsboard.server.common.data.id.UserId;

import java.io.Serializable;

@Data
public class UserAuthDataChangedEvent implements Serializable {
    private final UserId userId;
    private final String sessionId;
    private final long ts;
    private final boolean dropAllSessions;

    public UserAuthDataChangedEvent(UserId userId, String sessionId, boolean dropAllSessions) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.dropAllSessions = dropAllSessions;
        this.ts = System.currentTimeMillis();
    }

}
