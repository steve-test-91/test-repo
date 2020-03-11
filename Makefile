SENTRY_URL=https://scefali.ngrok.io
SENTRY_ORG=sentry
SENTRY_PROJECT=react
VERSION=2-4-v2
# SENTRY_URL=https://sentry.io
# SENTRY_ORG=plugin-org
# SENTRY_PROJECT=react
# VERSION=`sentry-cli --url $(SENTRY_URL) releases propose-version`


setup_release: create_release associate_commits upload_sourcemaps

create_release:
	sentry-cli --url $(SENTRY_URL) releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(VERSION)

associate_commits:
	sentry-cli --url $(SENTRY_URL) releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(VERSION)

upload_sourcemaps:
	sentry-cli  --url $(SENTRY_URL) releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(VERSION) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate build/$(PREFIX)
