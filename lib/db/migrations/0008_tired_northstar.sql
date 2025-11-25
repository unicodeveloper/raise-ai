ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Suggestion" ADD CONSTRAINT "suggestion_document_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
