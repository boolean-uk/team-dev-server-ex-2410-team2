-- CreateTable
CREATE TABLE "_UserLikesPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikesPosts_AB_unique" ON "_UserLikesPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikesPosts_B_index" ON "_UserLikesPosts"("B");

-- AddForeignKey
ALTER TABLE "_UserLikesPosts" ADD CONSTRAINT "_UserLikesPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikesPosts" ADD CONSTRAINT "_UserLikesPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
