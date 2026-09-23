import { PrismaClient } from "@prisma/client";

export interface PageVersionSnapshot {
  versionNumber: number;
  pageId: string;
  label?: string;
  note?: string;
  snapshotJson: string;
  createdBy: string;
  createdAt: Date | string;
}

/**
 * Creates a revision snapshot for a page before changes are saved
 */
export async function createPageRevision(
  prisma: PrismaClient,
  pageId: string,
  note: string,
  createdBy: string = "Admin ERP"
): Promise<PageVersionSnapshot> {
  const page = await prisma.pageConfig.findUnique({
    where: { id: pageId },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (!page) {
    throw new Error(`Page with id '${pageId}' not found.`);
  }

  const latestVersion = await prisma.pageVersion.findFirst({
    where: { pageId },
    orderBy: { versionNumber: "desc" },
  });

  const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

  const snapshotData = {
    title: page.title,
    slug: page.slug,
    description: page.description,
    status: page.status,
    layoutType: page.layoutType,
    sections: page.sections,
  };

  const created = await prisma.pageVersion.create({
    data: {
      pageId,
      versionNumber: nextVersionNumber,
      label: `Version ${nextVersionNumber}`,
      note,
      snapshotJson: JSON.stringify(snapshotData),
      createdBy,
    },
  });

  return {
    versionNumber: created.versionNumber,
    pageId: created.pageId,
    label: created.label || `Version ${created.versionNumber}`,
    note: created.note || "",
    snapshotJson: created.snapshotJson,
    createdBy: created.createdBy || "Admin ERP",
    createdAt: created.createdAt,
  };
}

/**
 * Restores a historical page version snapshot
 */
export async function restorePageRevision(
  prisma: PrismaClient,
  versionId: string
) {
  const version = await prisma.pageVersion.findUnique({
    where: { id: versionId },
  });

  if (!version) {
    throw new Error(`Version '${versionId}' not found.`);
  }

  const parsedSnapshot = JSON.parse(version.snapshotJson);

  // Update the page config
  await prisma.pageConfig.update({
    where: { id: version.pageId },
    data: {
      title: parsedSnapshot.title,
      description: parsedSnapshot.description,
      status: parsedSnapshot.status,
      layoutType: parsedSnapshot.layoutType,
      updatedAt: new Date(),
    },
  });

  // Re-create sections if present in snapshot
  if (Array.isArray(parsedSnapshot.sections)) {
    await prisma.pageSection.deleteMany({
      where: { pageId: version.pageId },
    });

    for (const sec of parsedSnapshot.sections) {
      await prisma.pageSection.create({
        data: {
          pageId: version.pageId,
          type: sec.type,
          name: sec.name,
          status: sec.status || "ACTIVE",
          sortOrder: sec.sortOrder || 0,
          isActive: sec.isActive ?? true,
          desktopVisible: sec.desktopVisible ?? true,
          mobileVisible: sec.mobileVisible ?? true,
          title: sec.title,
          subtitle: sec.subtitle,
          contentJson: sec.contentJson || "{}",
          stylingJson: sec.stylingJson || "{}",
          settings: sec.settings,
          style: sec.style,
          responsiveSettings: sec.responsiveSettings,
          dataSource: sec.dataSource,
          visibilityRules: sec.visibilityRules,
        },
      });
    }
  }

  return { success: true, restoredVersion: version.versionNumber };
}
