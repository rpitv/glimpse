--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_logs (
    "user" integer NOT NULL,
    service character varying(100) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip character varying(60),
    id integer NOT NULL
);


ALTER TABLE public.access_logs OWNER TO postgres;

--
-- Name: TABLE access_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.access_logs IS 'Logs for when a user logs into a machine or service using their RPI TV account';


--
-- Name: COLUMN access_logs."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.access_logs."user" IS 'FK - Reference to the user that this log is for.';


--
-- Name: COLUMN access_logs.service; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.access_logs.service IS 'Name/ID of the service which the user logged into';


--
-- Name: COLUMN access_logs."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.access_logs."timestamp" IS 'Timestamp at which this login occurred';


--
-- Name: COLUMN access_logs.ip; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.access_logs.ip IS 'IP address from which this access request initiated, if available. Null if unknown';


--
-- Name: COLUMN access_logs.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.access_logs.id IS 'Unique ID to represent this access log';


--
-- Name: alert_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alert_logs (
    id integer NOT NULL,
    message character varying(300) NOT NULL,
    severity character varying(8) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alert_logs OWNER TO postgres;

--
-- Name: TABLE alert_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.alert_logs IS 'Miscelaneous message logs about the status of Glimpse applications.';


--
-- Name: COLUMN alert_logs.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.alert_logs.id IS 'Unique ID of this alert';


--
-- Name: COLUMN alert_logs.message; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.alert_logs.message IS 'Message included with this alert';


--
-- Name: COLUMN alert_logs.severity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.alert_logs.severity IS 'How critical this alert is. Should be "INFO", "LOW", "MEDIUM", "HIGH", or "CRITICAL". Higher severity levels can change who gets notified and how.';


--
-- Name: COLUMN alert_logs."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.alert_logs."timestamp" IS 'Time at which this alert was received';


--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    tag integer,
    name character varying(150) NOT NULL,
    last_known_location character varying(100),
    last_known_handler integer,
    is_lost boolean DEFAULT false NOT NULL,
    notes character varying(500),
    purchase_price integer,
    purchase_location character varying(1000),
    purchase_date date,
    model_number character varying(100),
    serial_number character varying(100),
    parent integer
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: TABLE assets; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.assets IS 'List of assets within RPI TV''s inventory, along with some data about the locations and states of each asset.';


--
-- Name: COLUMN assets.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.id IS 'Unique ID of this asset.';


--
-- Name: COLUMN assets.tag; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.tag IS 'Tag ID on this asset. May be null if a tag has not been placed yet.';


--
-- Name: COLUMN assets.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.name IS 'Display name of this asset.';


--
-- Name: COLUMN assets.last_known_location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.last_known_location IS 'Last known location of this asset, or null if unknown/not applicable.';


--
-- Name: COLUMN assets.last_known_handler; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.last_known_handler IS 'ID of the user who last checked out this equipment, or null if unknown/not applicable';


--
-- Name: COLUMN assets.is_lost; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.is_lost IS 'Whether this asset is lost or not.';


--
-- Name: COLUMN assets.notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.notes IS 'Any notes related to this asset, or alternatively null if no notes currently. These notes should obviously be displayed to a user when they check out a piece of equipment.';


--
-- Name: COLUMN assets.purchase_price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.purchase_price IS 'Price of this asset when purchased, in cents, if applicable/known.';


--
-- Name: COLUMN assets.purchase_location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.purchase_location IS 'Location/URL of where this asset was purchased, if known/applicable. Otherwise, null.';


--
-- Name: COLUMN assets.purchase_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.purchase_date IS 'Date of when this asset was purchased, if known/applicable. Otherwise null.';


--
-- Name: COLUMN assets.model_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.model_number IS 'Model number of this asset, if known/applicable. Otherwise, null.';


--
-- Name: COLUMN assets.serial_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.serial_number IS 'Serial number of this asset, if known/applicable. Otherwise null.';


--
-- Name: COLUMN assets.parent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assets.parent IS 'ID of parent asset which this asset should always "follow", or null if none.';


--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.assets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    "user" integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modification_type character varying(20) NOT NULL,
    modified_table character varying(50),
    modified_field character varying(50) NOT NULL,
    previous_value text,
    comment character varying(200),
    metadata json
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.audit_logs IS 'Log individual changes to the database, allowing for easy rollback to earlier periods in time';


--
-- Name: COLUMN audit_logs.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.id IS 'Unique ID to represent this change';


--
-- Name: COLUMN audit_logs."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs."user" IS 'FK - User ID who took the action that this row corresponds to. Null if no user was responsible.';


--
-- Name: COLUMN audit_logs."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs."timestamp" IS 'Timestamp at which this modification took place';


--
-- Name: COLUMN audit_logs.modification_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.modification_type IS 'The type of modification that was made to the database. Typically "INSERT", "UPDATE", or "DELETE"';


--
-- Name: COLUMN audit_logs.modified_table; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.modified_table IS 'Name of the table which was modified, or null if the modification was made to the database and not a table.';


--
-- Name: COLUMN audit_logs.modified_field; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.modified_field IS 'Name of the modfied field. In the case of INSERT/UPDATE/DELETE this should be a column name. For other events it could be something like the index name, table name, etc. Nullable for edge cases, but should be rare or never.';


--
-- Name: COLUMN audit_logs.previous_value; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.previous_value IS 'The value that was previously stored in the modified field, if there is one. ';


--
-- Name: COLUMN audit_logs.comment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.comment IS 'Human-readable comment detailing the purpose/cause of the change.';


--
-- Name: COLUMN audit_logs.metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_logs.metadata IS 'Any additional information about the change that may be useful.';


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    author integer NOT NULL,
    author_display_name character varying(100),
    title character varying(150) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: TABLE blog_posts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.blog_posts IS 'Blog posts written by the RPI TV team';


--
-- Name: COLUMN blog_posts.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.id IS 'ID of this blog.';


--
-- Name: COLUMN blog_posts.posted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.posted_at IS 'Time at which this blog was originally posted';


--
-- Name: COLUMN blog_posts.content; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.content IS 'Text of this blog post. Should support markdown.';


--
-- Name: COLUMN blog_posts.author; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.author IS 'FK - ID of the person who should be displayed as creating this blog post. Might not necessarily be the person who actually wrote it. For this, look in audit logs.';


--
-- Name: COLUMN blog_posts.author_display_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.author_display_name IS 'Custom name to display in the event that you don''t want an individual person''s name to appear on the blog post.';


--
-- Name: COLUMN blog_posts.title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.blog_posts.title IS 'Title of this blog post';


--
-- Name: blog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.blog_posts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.blog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50),
    priority integer DEFAULT 0 NOT NULL,
    parent integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: TABLE categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.categories IS 'Categorizations of different types of content on the Glimpse website';


--
-- Name: COLUMN categories.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.categories.id IS 'Unique ID of the category';


--
-- Name: COLUMN categories.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.categories.name IS 'Display name of this Category';


--
-- Name: COLUMN categories.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.categories.priority IS 'The higher the priority, the higher this Category should appear in a list. Two or more Categories with equal priority should be sorted alphabetically.';


--
-- Name: COLUMN categories.parent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.categories.parent IS 'Parent Category which this Category should appear under. Null for no parent.';


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: contact_submission_assignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submission_assignees (
    submission integer NOT NULL,
    "user" integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.contact_submission_assignees OWNER TO postgres;

--
-- Name: TABLE contact_submission_assignees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contact_submission_assignees IS 'Users who are assigned to deal with contact form submissions';


--
-- Name: COLUMN contact_submission_assignees.submission; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submission_assignees.submission IS 'FK - ID of the contact form submission that this user is responsible for.';


--
-- Name: COLUMN contact_submission_assignees."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submission_assignees."user" IS 'FK - ID of the user who is responsible for dealing with this contact form submission.';


--
-- Name: COLUMN contact_submission_assignees.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submission_assignees.id IS 'Unique ID of this user-submission connection';


--
-- Name: contact_submission_assignees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_submission_assignees ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contact_submission_assignees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    email character varying(300) NOT NULL,
    name character varying(100) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    additional_data json
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: TABLE contact_submissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contact_submissions IS 'Submissions on the RPI TV contact us form';


--
-- Name: COLUMN contact_submissions.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions.id IS 'ID of this particular contact request';


--
-- Name: COLUMN contact_submissions.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions.email IS 'Email address of the person who sent in this contact request';


--
-- Name: COLUMN contact_submissions.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions.name IS 'First and last name of the person emailing, or however they would like to be addressed';


--
-- Name: COLUMN contact_submissions."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions."timestamp" IS 'Timestamp at which this request was received.';


--
-- Name: COLUMN contact_submissions.resolved; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions.resolved IS 'Whether the topic being discussed in this form has been resolved.';


--
-- Name: COLUMN contact_submissions.additional_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.contact_submissions.additional_data IS 'Any additional data submitted with this contact request. E.g., event date, time, and location for event requests. ';


--
-- Name: contactforms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_submissions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contactforms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: credits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credits (
    production integer NOT NULL,
    person integer NOT NULL,
    title character varying(100),
    priority integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.credits OWNER TO postgres;

--
-- Name: TABLE credits; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.credits IS 'Credits linking individual people to the productions which they contributed to.';


--
-- Name: COLUMN credits.production; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.credits.production IS 'FK - ID of production which this credit is for';


--
-- Name: COLUMN credits.person; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.credits.person IS 'FK - ID of person who this credit is for';


--
-- Name: COLUMN credits.title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.credits.title IS 'Position this person had during the production';


--
-- Name: COLUMN credits.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.credits.priority IS 'Priority of this credit entry. Higher priority entries appear before lower priority in the list. Equal priority items should be sorted alphabetically';


--
-- Name: COLUMN credits.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.credits.id IS 'Unique ID of this Credit';


--
-- Name: credits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.credits ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.credits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_permissions (
    id integer NOT NULL,
    "group" integer NOT NULL,
    action character varying(100) NOT NULL,
    subject character varying(300)[] NOT NULL,
    fields character varying(100)[],
    conditions json,
    inverted boolean DEFAULT false NOT NULL,
    reason character varying(300)
);


ALTER TABLE public.group_permissions OWNER TO postgres;

--
-- Name: TABLE group_permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.group_permissions IS 'Permissions settings for groups. Rows are structured to follow the CASL permissions schema. https://casl.js.org/v5/en/guide/define-rules';


--
-- Name: COLUMN group_permissions.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.id IS 'Unique ID of this group permission.';


--
-- Name: COLUMN group_permissions."group"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions."group" IS 'FK - ID of the group which this permission applies to.';


--
-- Name: COLUMN group_permissions.action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.action IS 'Action which this permission is allowing, or "manage" for all permissions.';


--
-- Name: COLUMN group_permissions.subject; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.subject IS 'Array of subject resource IDs which this permission applies to, or null to apply to all subjects. The preferred syntax to apply to all subjects is to use the subject "all" instead.';


--
-- Name: COLUMN group_permissions.fields; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.fields IS 'Optional list of fields on the given subject(s) which this permission applies to, or null to apply to all fields.';


--
-- Name: COLUMN group_permissions.conditions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.conditions IS 'MongoDB-like conditional JSON object which is used to filter which subjects this permission applies to based off of the values of their properties. Or, null to apply this permission regardless. https://casl.js.org/v5/en/guide/conditions-in-depth';


--
-- Name: COLUMN group_permissions.inverted; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.inverted IS 'Whether this is an "inverted" permission, i.e. it denies the user instead of allowing. This is CASL terminology. Inverted permissions should be avoided, for the sake of simplicity.';


--
-- Name: COLUMN group_permissions.reason; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.group_permissions.reason IS 'Error message to display to users for why they were denied permission, if this is an inverted permission. If this is not an inverted permission, this does nothing. Alternatively, leave null for no specific error message.';


--
-- Name: group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.group_permissions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    parent integer,
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: TABLE groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.groups IS 'Groups are a way to control permissions for multiple users simultaneously, as well as logically separate different committees, e.g.';


--
-- Name: COLUMN groups.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.id IS 'ID of this group. Primary key';


--
-- Name: COLUMN groups.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.name IS 'Display name of this group';


--
-- Name: COLUMN groups.parent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.parent IS 'FK - Reference to parent group, or null if no parent group exists.';


--
-- Name: COLUMN groups.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.groups.priority IS 'Priority of this group when compared to other groups that an individual user belongs to. This is most important for determining permission priority. A higher priority means that this groups permissions should take prevalence over a group with lower priority. If two groups are equal priority then sorting should be based off of name, followed by ID.';


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.groups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(200),
    path character varying(1000) NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: TABLE images; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.images IS 'Images that have been uploaded by users and are used by other resources ';


--
-- Name: COLUMN images.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.images.id IS 'Unique ID of this image';


--
-- Name: COLUMN images.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.images.name IS 'Display name of this image.';


--
-- Name: COLUMN images.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.images.description IS 'Description of this image which can be displayed below the image or as its alt text, for example';


--
-- Name: COLUMN images.path; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.images.path IS 'Path to this image. Can be a local path on the current domain, or a static path to a URL (not recommended)';


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.images ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: logs_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.access_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.logs_access_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: logs_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.alert_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.logs_alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: logs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.logs_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    pronouns character varying(20),
    graduation date,
    start date NOT NULL,
    "end" date GENERATED ALWAYS AS (graduation) STORED,
    description text
);


ALTER TABLE public.people OWNER TO postgres;

--
-- Name: TABLE people; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.people IS 'Individual people who have been a member of the club or participated in the club in some capacity. People don''t necessarily need their own account.';


--
-- Name: COLUMN people.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.id IS 'Unique ID of this Person';


--
-- Name: COLUMN people.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.name IS 'Display name of this person';


--
-- Name: COLUMN people.pronouns; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.pronouns IS 'Optional pronouns for the person. If null, the user''s pronouns should not be displayed at all, not assumed.';


--
-- Name: COLUMN people.graduation; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.graduation IS 'Expected date of graduation from RPI. Only relevant for members who were part of RPI TV while they were a student at RPI. Null to not display.';


--
-- Name: COLUMN people.start; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.start IS 'Date on which this Person joined RPI TV.';


--
-- Name: COLUMN people."end"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people."end" IS 'Date on which this Person is expected to leave RPI TV, or null if unknown. Defaults to the same day the person is graduating';


--
-- Name: COLUMN people.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people.description IS 'Description of this member, i.e. an "about me" section, preferrably markdown-compatible. Null for blank';


--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.people ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.people_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: people_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people_images (
    image integer NOT NULL,
    person integer NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.people_images OWNER TO postgres;

--
-- Name: TABLE people_images; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.people_images IS 'Links images to people, i.e. allows tagging people in images';


--
-- Name: COLUMN people_images.image; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people_images.image IS 'FK - ID of the image which this relation is connected to';


--
-- Name: COLUMN people_images.person; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people_images.person IS 'FK - ID of the person which this relation is connected to';


--
-- Name: COLUMN people_images.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people_images.priority IS 'Priority used when determining the order of photos to display when a person is tagged in multiple photos';


--
-- Name: COLUMN people_images.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.people_images.id IS 'Unique ID of this person-image relation';


--
-- Name: people_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.people_images ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.people_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: production_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_images (
    production integer NOT NULL,
    image integer NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.production_images OWNER TO postgres;

--
-- Name: TABLE production_images; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.production_images IS 'Relation connecting images to productions';


--
-- Name: COLUMN production_images.production; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_images.production IS 'FK - ID of the production that this image is connected to';


--
-- Name: COLUMN production_images.image; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_images.image IS 'FK - The ID of the image which is connected to this production';


--
-- Name: COLUMN production_images.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_images.priority IS 'Priority of this image when there are multiple images linked to the production. Highest priority image will appear first.';


--
-- Name: COLUMN production_images.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_images.id IS 'Unique ID of this production-image relation';


--
-- Name: production_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.production_images ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: production_rsvps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_rsvps (
    production integer NOT NULL,
    "user" integer NOT NULL,
    will_attend character varying(5),
    notes text,
    id integer NOT NULL
);


ALTER TABLE public.production_rsvps OWNER TO postgres;

--
-- Name: TABLE production_rsvps; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.production_rsvps IS 'Users who have responded to the form asking for volunteers at an RPI TV production, or they were manually added. ';


--
-- Name: COLUMN production_rsvps.production; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_rsvps.production IS 'FK - ID of the production which the user is attending';


--
-- Name: COLUMN production_rsvps."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_rsvps."user" IS 'FK - User which is attending the RPI TV production';


--
-- Name: COLUMN production_rsvps.will_attend; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_rsvps.will_attend IS 'Whether the user plans on attending. Should be "YES", "NO" or "MAYBE". Can also be null if the user has not responded or retracted their response.';


--
-- Name: COLUMN production_rsvps.notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_rsvps.notes IS 'Additional notes provided by the user with regards to their attendance at this event.';


--
-- Name: COLUMN production_rsvps.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_rsvps.id IS 'Unique ID of this user''s RSVP to a production';


--
-- Name: production_rsvps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.production_rsvps ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_rsvps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: production_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_tags (
    production integer NOT NULL,
    tag character varying(50) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.production_tags OWNER TO postgres;

--
-- Name: TABLE production_tags; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.production_tags IS 'Tags applied to productions. Gives more control over searching, as well as applying permissions based off of tags';


--
-- Name: COLUMN production_tags.production; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_tags.production IS 'FK - Production which this tag is applied to';


--
-- Name: COLUMN production_tags.tag; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_tags.tag IS 'Tag value. Must not contain the colon character';


--
-- Name: COLUMN production_tags.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_tags.id IS 'ID of the given production tag';


--
-- Name: production_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.production_tags ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: production_videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_videos (
    production integer NOT NULL,
    video integer NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.production_videos OWNER TO postgres;

--
-- Name: TABLE production_videos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.production_videos IS 'Relation connecting videos to productions';


--
-- Name: COLUMN production_videos.production; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_videos.production IS 'FK - ID of the production that this video is connected to';


--
-- Name: COLUMN production_videos.video; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_videos.video IS 'FK - The ID of the video which is connected to this production';


--
-- Name: COLUMN production_videos.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_videos.priority IS 'Priority of this video when there are multiple videos linked to the production. Highest priority video will appear first.';


--
-- Name: COLUMN production_videos.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.production_videos.id IS 'Unique ID of this production-video relation';


--
-- Name: production_videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.production_videos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.production_videos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    is_live boolean DEFAULT true NOT NULL,
    category integer,
    closet_location character varying(100),
    event_location character varying(100),
    team_notes text,
    discord_server character(18),
    discord_channel character(18),
    thumbnail integer,
    closet_time timestamp without time zone
);


ALTER TABLE public.productions OWNER TO postgres;

--
-- Name: TABLE productions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.productions IS 'Stores individual productions which appear on the productions list';


--
-- Name: COLUMN productions.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.id IS 'Unique identifier for this production';


--
-- Name: COLUMN productions.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.name IS 'Name of this event';


--
-- Name: COLUMN productions.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.description IS 'Text which either describes or adds to the production in some capacity. Should be markdown capable if possible. Null for no text';


--
-- Name: COLUMN productions.start_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.start_time IS 'Timestamp at which the event is planned to start. Can be null if not applicable or unknown, but should be discouraged as that disables many integrations';


--
-- Name: COLUMN productions.end_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.end_time IS 'Estimated time at which the event will conclude. This should be the time at which the broadcast ends. Null if not applicable or unknown.';


--
-- Name: COLUMN productions.is_live; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.is_live IS 'Whether this event is livestreamed or not';


--
-- Name: COLUMN productions.category; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.category IS 'FK - Category which this production belongs to, or null if no category.';


--
-- Name: COLUMN productions.closet_location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.closet_location IS 'Location for the team to meet for closet, or null if not applicable or unknown.';


--
-- Name: COLUMN productions.event_location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.event_location IS 'Location at which the event is taking place, or null if not applicable or unknown.';


--
-- Name: COLUMN productions.team_notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.team_notes IS 'Note which should be sent to the club attendees. Optional if there is no note to add.';


--
-- Name: COLUMN productions.discord_server; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.discord_server IS 'ID of the Discord server which discord_channel is located in, if it exists. If discord_channel is set, then this must be set as well.';


--
-- Name: COLUMN productions.discord_channel; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.discord_channel IS 'ID of the Discord channel which is being used for this production, if there is one. The Discord bot should have access to the channel if this is set.';


--
-- Name: COLUMN productions.thumbnail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.thumbnail IS 'FK - Reference to the Image which should be used as the thumbnail for this production.';


--
-- Name: COLUMN productions.closet_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.productions.closet_time IS 'Time at which the team should meet at the closet location, or null if unknown.';


--
-- Name: productions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.productions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.productions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: redirects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.redirects (
    key character varying(100) NOT NULL,
    location character varying(3000) NOT NULL,
    expires timestamp without time zone,
    id integer NOT NULL
);


ALTER TABLE public.redirects OWNER TO postgres;

--
-- Name: TABLE redirects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.redirects IS 'List of URL redirects, i.e. a URL shortener.';


--
-- Name: COLUMN redirects.key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.redirects.key IS 'Key of this redirect. This is what is put in the URL, e.g. if the key is "donate" then the URL might be rpi.tv/donate.';


--
-- Name: COLUMN redirects.location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.redirects.location IS 'URL to redirect the user to. Can be a local URL on the RPI TV website by using a relative path, or any external site by using a full URL.';


--
-- Name: COLUMN redirects.expires; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.redirects.expires IS 'Timestamp at which this redirect expires and should be deleted. Null for never.';


--
-- Name: COLUMN redirects.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.redirects.id IS 'Unique ID of this Redirect';


--
-- Name: redirects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.redirects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.redirects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    person integer NOT NULL,
    name character varying(100) NOT NULL,
    start_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_time timestamp without time zone,
    priority integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: TABLE roles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.roles IS 'Roles within the club for a given person during a given timespan. ';


--
-- Name: COLUMN roles.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.id IS 'Unique ID of this role for this person';


--
-- Name: COLUMN roles.person; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.person IS 'FK - ID of the person which this role belongs to';


--
-- Name: COLUMN roles.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.name IS 'Name of this role to display';


--
-- Name: COLUMN roles.start_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.start_time IS 'Timestamp at which this person starts/started in this role';


--
-- Name: COLUMN roles.end_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.end_time IS 'Timestamp at which this person ends their position in this role. Null if unknown.';


--
-- Name: COLUMN roles.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles.priority IS 'Priority used to order which roles should be displayed first if the person has multiple roles. Highest priority displayed first. If equal priority then sorting is based off of which position was started first.';


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups (
    id integer NOT NULL,
    "user" integer NOT NULL,
    "group" integer NOT NULL
);


ALTER TABLE public.user_groups OWNER TO postgres;

--
-- Name: TABLE user_groups; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_groups IS 'Connection between Users and the Groups to which they belong.';


--
-- Name: COLUMN user_groups.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_groups.id IS 'Unique ID of this user-group association.';


--
-- Name: COLUMN user_groups."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_groups."user" IS 'FK - ID of the user which this connection is for.';


--
-- Name: COLUMN user_groups."group"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_groups."group" IS 'FK - ID of the group which this user is a part of.';


--
-- Name: user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_groups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id integer NOT NULL,
    "user" integer NOT NULL,
    action character varying(100) NOT NULL,
    subject character varying(300)[] NOT NULL,
    fields character varying(100)[],
    conditions json,
    inverted boolean DEFAULT false NOT NULL,
    reason character varying(300)
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: TABLE user_permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_permissions IS 'Permissions settings for users. Rows are structured to follow the CASL permissions schema. https://casl.js.org/v5/en/guide/define-rules';


--
-- Name: COLUMN user_permissions.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.id IS 'Unique ID of this user permission.';


--
-- Name: COLUMN user_permissions."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions."user" IS 'FK - ID of the user which this permission applies to.';


--
-- Name: COLUMN user_permissions.action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.action IS 'Action which this permission is allowing, or "manage" for all permissions.';


--
-- Name: COLUMN user_permissions.subject; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.subject IS 'Array of subject resource IDs which this permission applies to, or null to apply to all subjects. The preferred syntax to apply to all subjects is to use the subject "all" instead.';


--
-- Name: COLUMN user_permissions.fields; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.fields IS 'Optional list of fields on the given subject(s) which this permission applies to, or null to apply to all fields.';


--
-- Name: COLUMN user_permissions.conditions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.conditions IS 'MongoDB-like conditional JSON object which is used to filter which subjects this permission applies to based off of the values of their properties. Or, null to apply this permission regardless. https://casl.js.org/v5/en/guide/conditions-in-depth';


--
-- Name: COLUMN user_permissions.inverted; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.inverted IS 'Whether this is an "inverted" permission, i.e. it denies the user instead of allowing. This is CASL terminology. Inverted permissions should be avoided, for the sake of simplicity.';


--
-- Name: COLUMN user_permissions.reason; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_permissions.reason IS 'Error message to display to users for why they were denied permission, if this is an inverted permission. If this is not an inverted permission, this does nothing. Alternatively, leave null for no specific error message.';


--
-- Name: user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_permissions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(8) NOT NULL,
    mail character varying(300) NOT NULL,
    person integer,
    discord integer,
    password character varying(300),
    joined timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Accounts created for members of RPI TV, or people who should have access to RPI TV services/resources.';


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.id IS 'Unique ID of this user';


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.username IS 'Name this user uses to log in to services/servers. Probably an RCS ID. Intentionally kept short due to Linux username limits. If more than 8 chars is really needed, this can probably be expanded later.';


--
-- Name: COLUMN users.mail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.mail IS 'Email address for this user to use on services which require an email address to log in. Emails can also automatically be sent to this email address when necessary.';


--
-- Name: COLUMN users.person; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.person IS 'FK - Person which is connected to this account. Technically not required, but should be used if you ever want to connect a user to their personal information such as name, picture, etc.';


--
-- Name: COLUMN users.discord; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.discord IS 'Discord account ID connected to this user. Similar to person, this can be null, but should be avoided to take full advantage of Glimpse features.';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.password IS 'Hash of this user''s password for password-based authentication. Not required, but without it, the user cannot login via password. Use the Argon2id cipher.';


--
-- Name: COLUMN users.joined; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.joined IS 'Timestamp at which this user account was created.';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    format character varying(32) NOT NULL,
    metadata json
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- Name: TABLE videos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.videos IS 'Video data linking to various different sources, e.g. RTMP, YouTube, HLS, etc.';


--
-- Name: COLUMN videos.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.videos.id IS 'Unique ID for this video';


--
-- Name: COLUMN videos.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.videos.name IS 'Name of this video. May be displayed to the user';


--
-- Name: COLUMN videos.format; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.videos.format IS 'Type of video format being used here. Multiple formats are supported, mainly HLS and EMBED as of now, but RTMP is also available.';


--
-- Name: COLUMN videos.metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.videos.metadata IS 'Information about how to retrieve this video based off of it''s video format. Video formats may each have their own data structures, hence the use of json.';


--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.videos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.videos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vote_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vote_responses (
    vote integer NOT NULL,
    "user" integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL,
    selection character varying(200) NOT NULL
);


ALTER TABLE public.vote_responses OWNER TO postgres;

--
-- Name: TABLE vote_responses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.vote_responses IS 'Responses from users to votes';


--
-- Name: COLUMN vote_responses.vote; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vote_responses.vote IS 'FK - Reference to the vote which this response applies to.';


--
-- Name: COLUMN vote_responses."user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vote_responses."user" IS 'FK - Reference to the user who made this vote.';


--
-- Name: COLUMN vote_responses."timestamp"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vote_responses."timestamp" IS 'time at which this vote was submitted';


--
-- Name: COLUMN vote_responses.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vote_responses.id IS 'Unique ID of this response';


--
-- Name: COLUMN vote_responses.selection; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vote_responses.selection IS 'The option that this user voted for in the list of options. This is a copy of the option text, so if the option is removed, users'' votes won''t be removed.';


--
-- Name: vote_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vote_responses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vote_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    question character varying(200) NOT NULL,
    options character varying(200)[] NOT NULL,
    expires timestamp without time zone,
    description text
);


ALTER TABLE public.votes OWNER TO postgres;

--
-- Name: TABLE votes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.votes IS 'List of votes that have been proposed to the members, or a subset of members.';


--
-- Name: COLUMN votes.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.votes.id IS 'Unique ID of this vote';


--
-- Name: COLUMN votes.question; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.votes.question IS 'Question that is being asked in the vote';


--
-- Name: COLUMN votes.options; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.votes.options IS 'Array of options that users who vote on this can select.';


--
-- Name: COLUMN votes.expires; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.votes.expires IS 'Timestamp at which this vote closes. Null for never expires';


--
-- Name: COLUMN votes.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.votes.description IS 'Any additional text which should be displayed beside the question itself. Optional';


--
-- Data for Name: access_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_logs ("user", service, "timestamp", ip, id) FROM stdin;
\.


--
-- Data for Name: alert_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alert_logs (id, message, severity, "timestamp") FROM stdin;
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, tag, name, last_known_location, last_known_handler, is_lost, notes, purchase_price, purchase_location, purchase_date, model_number, serial_number, parent) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "user", "timestamp", modification_type, modified_table, modified_field, previous_value, comment, metadata) FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, posted_at, content, author, author_display_name, title) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, priority, parent) FROM stdin;
\.


--
-- Data for Name: contact_submission_assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submission_assignees (submission, "user", "timestamp", id) FROM stdin;
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, email, name, "timestamp", resolved, additional_data) FROM stdin;
\.


--
-- Data for Name: credits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credits (production, person, title, priority, id) FROM stdin;
\.


--
-- Data for Name: group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_permissions (id, "group", action, subject, fields, conditions, inverted, reason) FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, parent, priority) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, name, description, path) FROM stdin;
\.


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.people (id, name, pronouns, graduation, start, description) FROM stdin;
\.


--
-- Data for Name: people_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.people_images (image, person, priority, id) FROM stdin;
\.


--
-- Data for Name: production_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_images (production, image, priority, id) FROM stdin;
\.


--
-- Data for Name: production_rsvps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_rsvps (production, "user", will_attend, notes, id) FROM stdin;
\.


--
-- Data for Name: production_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_tags (production, tag, id) FROM stdin;
\.


--
-- Data for Name: production_videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_videos (production, video, priority, id) FROM stdin;
\.


--
-- Data for Name: productions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productions (id, name, description, start_time, end_time, is_live, category, closet_location, event_location, team_notes, discord_server, discord_channel, thumbnail, closet_time) FROM stdin;
\.


--
-- Data for Name: redirects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.redirects (key, location, expires, id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, person, name, start_time, end_time, priority) FROM stdin;
\.


--
-- Data for Name: user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_groups (id, "user", "group") FROM stdin;
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, "user", action, subject, fields, conditions, inverted, reason) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, mail, person, discord, password, joined) FROM stdin;
1	robere2	robere2@rpi.edu	\N	\N	\N	2022-06-07 17:31:34.122
3	sachid	sachid@rpi.edu	\N	\N	\N	2022-06-10 13:44:37.285712
4	bowerj5	bowerj5@rpi.edu	\N	\N	\N	2022-06-10 13:44:37.285712
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos (id, name, format, metadata) FROM stdin;
\.


--
-- Data for Name: vote_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vote_responses (vote, "user", "timestamp", id, selection) FROM stdin;
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votes (id, question, options, expires, description) FROM stdin;
\.


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 1, false);


--
-- Name: blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: contact_submission_assignees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_submission_assignees_id_seq', 1, false);


--
-- Name: contactforms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contactforms_id_seq', 1, false);


--
-- Name: credits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.credits_id_seq', 1, false);


--
-- Name: group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_permissions_id_seq', 1, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 1, false);


--
-- Name: logs_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_access_id_seq', 1, false);


--
-- Name: logs_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_alerts_id_seq', 1, true);


--
-- Name: logs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_audit_id_seq', 1, false);


--
-- Name: people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.people_id_seq', 1, false);


--
-- Name: people_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.people_images_id_seq', 1, false);


--
-- Name: production_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_images_id_seq', 1, false);


--
-- Name: production_rsvps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_rsvps_id_seq', 1, false);


--
-- Name: production_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_tags_id_seq', 1, false);


--
-- Name: production_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_videos_id_seq', 1, false);


--
-- Name: productions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productions_id_seq', 1, false);


--
-- Name: redirects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.redirects_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_groups_id_seq', 1, false);


--
-- Name: user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_permissions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_id_seq', 1, false);


--
-- Name: vote_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vote_responses_id_seq', 1, false);


--
-- Name: access_logs access_logs_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_logs
    ADD CONSTRAINT access_logs_pk PRIMARY KEY (id);


--
-- Name: alert_logs alert_logs_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alert_logs
    ADD CONSTRAINT alert_logs_pk PRIMARY KEY (id);


--
-- Name: assets assets_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pk PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pk PRIMARY KEY (id);


--
-- Name: blog_posts blog_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_pk PRIMARY KEY (id);


--
-- Name: categories categories_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pk PRIMARY KEY (id);


--
-- Name: contact_submission_assignees contact_submission_assignees_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission_assignees
    ADD CONSTRAINT contact_submission_assignees_pk PRIMARY KEY (id);


--
-- Name: contact_submission_assignees contact_submission_assignees_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission_assignees
    ADD CONSTRAINT contact_submission_assignees_pk_2 UNIQUE ("user", submission);


--
-- Name: contact_submissions contact_submissions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pk PRIMARY KEY (id);


--
-- Name: credits credits_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_pk PRIMARY KEY (id);


--
-- Name: credits credits_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_pk_2 UNIQUE (production, person);


--
-- Name: group_permissions group_permissions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_pk PRIMARY KEY (id);


--
-- Name: groups groups_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pk PRIMARY KEY (id);


--
-- Name: images images_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pk PRIMARY KEY (id);


--
-- Name: people_images people_images_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people_images
    ADD CONSTRAINT people_images_pk PRIMARY KEY (id);


--
-- Name: people_images people_images_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people_images
    ADD CONSTRAINT people_images_pk_2 UNIQUE (image, person);


--
-- Name: people people_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pk PRIMARY KEY (id);


--
-- Name: production_images production_images_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_images
    ADD CONSTRAINT production_images_pk PRIMARY KEY (id);


--
-- Name: production_images production_images_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_images
    ADD CONSTRAINT production_images_pk_2 UNIQUE (production, image);


--
-- Name: production_rsvps production_rsvps_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_rsvps
    ADD CONSTRAINT production_rsvps_pk PRIMARY KEY (id);


--
-- Name: production_rsvps production_rsvps_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_rsvps
    ADD CONSTRAINT production_rsvps_pk_2 UNIQUE (production, "user");


--
-- Name: production_tags production_tags_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_tags
    ADD CONSTRAINT production_tags_pk PRIMARY KEY (id);


--
-- Name: production_tags production_tags_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_tags
    ADD CONSTRAINT production_tags_pk_2 UNIQUE (production, tag);


--
-- Name: production_videos production_videos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_videos
    ADD CONSTRAINT production_videos_pk PRIMARY KEY (id);


--
-- Name: production_videos production_videos_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_videos
    ADD CONSTRAINT production_videos_pk_2 UNIQUE (production, video);


--
-- Name: productions productions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productions
    ADD CONSTRAINT productions_pk PRIMARY KEY (id);


--
-- Name: redirects redirects_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pk PRIMARY KEY (id);


--
-- Name: redirects redirects_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pk_2 UNIQUE (key);


--
-- Name: roles roles_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pk PRIMARY KEY (id);


--
-- Name: user_groups user_groups_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pk PRIMARY KEY (id);


--
-- Name: user_groups user_groups_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pk_2 UNIQUE ("user", "group");


--
-- Name: user_permissions user_permissions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pk PRIMARY KEY (id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: videos videos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pk PRIMARY KEY (id);


--
-- Name: vote_responses vote_responses_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_responses
    ADD CONSTRAINT vote_responses_pk PRIMARY KEY (id);


--
-- Name: vote_responses vote_responses_pk_2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_responses
    ADD CONSTRAINT vote_responses_pk_2 UNIQUE (vote, "user");


--
-- Name: votes votes_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pk PRIMARY KEY (id);


--
-- Name: access_logs_for_service_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_logs_for_service_index ON public.access_logs USING btree ("user", service);


--
-- Name: access_logs_ip_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_logs_ip_index ON public.access_logs USING btree (ip);


--
-- Name: access_logs_service_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_logs_service_index ON public.access_logs USING btree (service);


--
-- Name: alert_logs_severity_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX alert_logs_severity_timestamp_index ON public.alert_logs USING btree (severity, "timestamp");


--
-- Name: assets_is_lost_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_is_lost_tag_index ON public.assets USING btree (is_lost, tag);


--
-- Name: assets_last_known_handler_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_last_known_handler_tag_index ON public.assets USING btree (last_known_handler, tag);


--
-- Name: assets_last_known_location_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_last_known_location_tag_index ON public.assets USING btree (last_known_location, tag);


--
-- Name: assets_name_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_name_tag_index ON public.assets USING btree (name, tag);


--
-- Name: assets_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_tag_index ON public.assets USING btree (tag);


--
-- Name: audit_logs_mtable_mf_mtype_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_mtable_mf_mtype_index ON public.audit_logs USING btree (modified_table, modified_field, modification_type);


--
-- Name: audit_logs_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_timestamp_index ON public.audit_logs USING btree ("timestamp");


--
-- Name: blog_author_posted_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_author_posted_at_index ON public.blog_posts USING btree (author, posted_at);


--
-- Name: blog_posted_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posted_at_index ON public.blog_posts USING btree (posted_at);


--
-- Name: blog_title_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_title_index ON public.blog_posts USING btree (title);


--
-- Name: categories_priority_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_priority_name_index ON public.categories USING btree (priority, name);


--
-- Name: contact_submission_assignees_user_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submission_assignees_user_index ON public.contact_submission_assignees USING btree ("user");


--
-- Name: contact_submissions_email_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submissions_email_timestamp_index ON public.contact_submissions USING btree (email, "timestamp");


--
-- Name: contact_submissions_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX contact_submissions_id_uindex ON public.contact_submissions USING btree (id);


--
-- Name: contact_submissions_timestamp_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contact_submissions_timestamp_index ON public.contact_submissions USING btree ("timestamp");


--
-- Name: credits_person_production_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX credits_person_production_index ON public.credits USING btree (person, production);


--
-- Name: credits_production_priority_title_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX credits_production_priority_title_index ON public.credits USING btree (production, priority, title);


--
-- Name: group_permissions_group_subject_action_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX group_permissions_group_subject_action_index ON public.group_permissions USING btree ("group", subject, action);


--
-- Name: groups_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX groups_name_index ON public.groups USING btree (name);


--
-- Name: groups_priority_name_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX groups_priority_name_id_index ON public.groups USING btree (priority, name, id);


--
-- Name: images_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX images_id_uindex ON public.images USING btree (id);


--
-- Name: people_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX people_id_uindex ON public.people USING btree (id);


--
-- Name: people_images_person_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX people_images_person_index ON public.people_images USING btree (person);


--
-- Name: production_images_production_priority_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX production_images_production_priority_index ON public.production_images USING btree (production, priority);


--
-- Name: production_rsvps_user_will_attend_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX production_rsvps_user_will_attend_index ON public.production_rsvps USING btree ("user", will_attend);


--
-- Name: production_tags_tag_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX production_tags_tag_index ON public.production_tags USING btree (tag);


--
-- Name: production_videos_production_priority_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX production_videos_production_priority_index ON public.production_videos USING btree (production, priority);


--
-- Name: productions_category_start_time_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX productions_category_start_time_name_index ON public.productions USING btree (category, start_time, name);


--
-- Name: productions_is_live_start_time_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX productions_is_live_start_time_index ON public.productions USING btree (is_live, start_time);


--
-- Name: productions_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX productions_name_index ON public.productions USING btree (name);


--
-- Name: productions_start_time_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX productions_start_time_name_index ON public.productions USING btree (start_time, name);


--
-- Name: redirects_expires_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX redirects_expires_index ON public.redirects USING btree (expires);


--
-- Name: roles_person_priority_start_time_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX roles_person_priority_start_time_index ON public.roles USING btree (person, priority, start_time);


--
-- Name: user_permissions_user_subject_action_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_permissions_user_subject_action_index ON public.user_permissions USING btree ("user", subject, action);


--
-- Name: users_discord_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_discord_uindex ON public.users USING btree (discord);


--
-- Name: users_mail_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_mail_uindex ON public.users USING btree (mail);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_uindex ON public.users USING btree (username);


--
-- Name: vote_responses_user_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vote_responses_user_index ON public.vote_responses USING btree ("user");


--
-- Name: votes_expires_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX votes_expires_index ON public.votes USING btree (expires);


--
-- Name: access_logs access_logs_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_logs
    ADD CONSTRAINT access_logs_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_assets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_assets_id_fk FOREIGN KEY (parent) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_users_id_fk FOREIGN KEY (last_known_handler) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audit_logs audit_logs_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: blog_posts blog_people_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_people_id_fk FOREIGN KEY (author) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: categories categories_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_categories_id_fk FOREIGN KEY (parent) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contact_submission_assignees contact_submission_assignees_contact_submissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission_assignees
    ADD CONSTRAINT contact_submission_assignees_contact_submissions_id_fk FOREIGN KEY (submission) REFERENCES public.contact_submissions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contact_submission_assignees contact_submission_assignees_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission_assignees
    ADD CONSTRAINT contact_submission_assignees_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credits credits_people_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_people_id_fk FOREIGN KEY (person) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credits credits_productions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_productions_id_fk FOREIGN KEY (production) REFERENCES public.productions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: group_permissions group_permissions_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_permissions
    ADD CONSTRAINT group_permissions_groups_id_fk FOREIGN KEY (id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: groups groups_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_groups_id_fk FOREIGN KEY (parent) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: people_images people_images_images_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people_images
    ADD CONSTRAINT people_images_images_id_fk FOREIGN KEY (image) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: people_images people_images_people_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people_images
    ADD CONSTRAINT people_images_people_id_fk FOREIGN KEY (person) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_images production_images_images_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_images
    ADD CONSTRAINT production_images_images_id_fk FOREIGN KEY (image) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_images production_images_productions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_images
    ADD CONSTRAINT production_images_productions_id_fk FOREIGN KEY (production) REFERENCES public.productions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_rsvps production_rsvps_productions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_rsvps
    ADD CONSTRAINT production_rsvps_productions_id_fk FOREIGN KEY (production) REFERENCES public.productions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_rsvps production_rsvps_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_rsvps
    ADD CONSTRAINT production_rsvps_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_tags production_tags_productions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_tags
    ADD CONSTRAINT production_tags_productions_id_fk FOREIGN KEY (production) REFERENCES public.productions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_videos production_videos_productions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_videos
    ADD CONSTRAINT production_videos_productions_id_fk FOREIGN KEY (production) REFERENCES public.productions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: production_videos production_videos_videos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_videos
    ADD CONSTRAINT production_videos_videos_id_fk FOREIGN KEY (video) REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: productions productions_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productions
    ADD CONSTRAINT productions_categories_id_fk FOREIGN KEY (category) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: productions productions_images_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productions
    ADD CONSTRAINT productions_images_id_fk FOREIGN KEY (thumbnail) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: roles roles_people_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_people_id_fk FOREIGN KEY (person) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_groups user_groups_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_groups_id_fk FOREIGN KEY ("group") REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_groups user_groups_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_permissions user_permissions_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_people_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_people_id_fk FOREIGN KEY (person) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vote_responses vote_responses_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_responses
    ADD CONSTRAINT vote_responses_users_id_fk FOREIGN KEY ("user") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vote_responses vote_responses_votes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote_responses
    ADD CONSTRAINT vote_responses_votes_id_fk FOREIGN KEY (vote) REFERENCES public.votes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

