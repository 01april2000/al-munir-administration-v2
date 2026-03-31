import { faker } from "@faker-js/faker/locale/id_ID";
import { PrismaClient, Role, JenisSantri, StatusSantri, JenisTagihan, StatusTagihan, JenisTransaksi, StatusTransaksi, StatusUangSaku, JenisBeasiswa, PeriodePembayaran } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password-hash";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

// Configuration
const NUM_USERS = 100;
const NUM_SANTRI = 80;
const NUM_TAGIHAN_PER_SANTRI = 6; // Average tagihan per santri
const NUM_TRANSAKSI_PER_SANTRI = 10; // Average transaksi per santri
const ADMIN_PASSWORD = "admin123"; // Password for admin account
const BENDAHARA_PASSWORD = "bendahara123"; // Password for all bendahara accounts
const SANTRI_PASSWORD = "santri123"; // Password for test santri accounts

// Helper arrays
const kelasSMK = ["X TKJ 1", "X TKJ 2", "X RPL 1", "X RPL 2", "XI TKJ 1", "XI TKJ 2", "XI RPL 1", "XI RPL 2", "XII TKJ 1", "XII TKJ 2", "XII RPL 1", "XII RPL 2"];
const kelasSMP = ["VII A", "VII B", "VII C", "VIII A", "VIII B", "VIII C", "IX A", "IX B", "IX C"];
const asramaList = ["Asrama Putra A", "Asrama Putra B", "Asrama Putri A", "Asrama Putri B", "Asrama Putri C"];
const bulanList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const jenisLaundryList = ["Cuci Setrika", "Cuci Kering", "Setrika Saja", "Express"];

function generateNIS(): string {
  return faker.string.numeric(8);
}

function generateKodeTagihan(): string {
  return `TG-${faker.string.numeric(8)}`;
}

function generateKodeTransaksi(): string {
  return `TRX-${faker.string.numeric(10)}`;
}

function generateOrderId(): string {
  return `ORDER-${Date.now()}-${faker.string.numeric(6)}`;
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await prisma.midtransTransaction.deleteMany();
  await prisma.tagihan.deleteMany();
  await prisma.transaksi.deleteMany();
  await prisma.santri.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Data cleaned");

  // Create Admin Users
  console.log("👤 Creating admin users...");
  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Admin Utama",
        email: "admin@almunir.sch.id",
        emailVerified: true,
        role: Role.ADMIN,
        image: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Bendahara SMK",
        email: "bendahara.smk@almunir.sch.id",
        emailVerified: true,
        role: Role.BENDAHARA_SMK,
        jenisSantri: JenisSantri.SMK,
        image: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Bendahara SMP",
        email: "bendahara.smp@almunir.sch.id",
        emailVerified: true,
        role: Role.BENDAHARA_SMP,
        jenisSantri: JenisSantri.SMP,
        image: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Bendahara Pondok",
        email: "bendahara.pondok@almunir.sch.id",
        emailVerified: true,
        role: Role.BENDAHARA_PONDOK,
        jenisSantri: JenisSantri.PONDOK,
        image: faker.image.avatar(),
      },
    }),
  ]);
  console.log(`✅ Created ${adminUsers.length} admin users`);

  // Create Accounts for Admin Users with different passwords
  console.log("🔑 Creating accounts for admin users...");
  // Use hashPassword with better-auth compatible scrypt parameters
  const hashedAdminPassword = await hashPassword(ADMIN_PASSWORD);
  const hashedBendaharaPassword = await hashPassword(BENDAHARA_PASSWORD);
  
  const adminAccounts = await Promise.all(
    adminUsers.map((user) =>
      prisma.account.create({
        data: {
          id: faker.string.uuid(),
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: user.role === Role.ADMIN ? hashedAdminPassword : hashedBendaharaPassword,
        },
      })
    )
  );
  console.log(`✅ Created ${adminAccounts.length} admin accounts`);
  console.log(`   - Admin password: ${ADMIN_PASSWORD}`);
  console.log(`   - Bendahara password: ${BENDAHARA_PASSWORD}`);

  // Create Test Santri Users (1 for each type)
  console.log("👤 Creating test santri users...");
  const testSantriUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Santri SMK Test",
        email: "santri.smk@almunir.sch.id",
        emailVerified: true,
        role: Role.SANTRI,
        jenisSantri: JenisSantri.SMK,
        image: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Santri SMP Test",
        email: "santri.smp@almunir.sch.id",
        emailVerified: true,
        role: Role.SANTRI,
        jenisSantri: JenisSantri.SMP,
        image: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        id: faker.string.uuid(),
        name: "Santri Pondok Test",
        email: "santri.pondok@almunir.sch.id",
        emailVerified: true,
        role: Role.SANTRI,
        jenisSantri: JenisSantri.PONDOK,
        image: faker.image.avatar(),
      },
    }),
  ]);
  console.log(`✅ Created ${testSantriUsers.length} test santri users`);

  // Create Accounts for Test Santri Users
  console.log("🔑 Creating accounts for test santri users...");
  // Use hashPassword with better-auth compatible scrypt parameters
  const hashedSantriPassword = await hashPassword(SANTRI_PASSWORD);
  const testSantriAccounts = await Promise.all(
    testSantriUsers.map((user) =>
      prisma.account.create({
        data: {
          id: faker.string.uuid(),
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: hashedSantriPassword,
        },
      })
    )
  );
  console.log(`✅ Created ${testSantriAccounts.length} test santri accounts with password: ${SANTRI_PASSWORD}`);

  // Create Santri Profiles for Test Users
  console.log("📚 Creating santri profiles for test users...");
  await Promise.all([
    prisma.santri.create({
      data: {
        nis: "12345678",
        nama: "Santri SMK Test",
        kelas: "X TKJ 1",
        asrama: "Asrama Putra A",
        wali: faker.person.fullName(),
        status: StatusSantri.AKTIF,
        beasiswa: false,
        jenisSantri: JenisSantri.SMK,
        saldoUangSaku: 500000,
        userId: testSantriUsers[0].id,
      },
    }),
    prisma.santri.create({
      data: {
        nis: "12345679",
        nama: "Santri SMP Test",
        kelas: "VII A",
        asrama: "Asrama Putri A",
        wali: faker.person.fullName(),
        status: StatusSantri.AKTIF,
        beasiswa: false,
        jenisSantri: JenisSantri.SMP,
        saldoUangSaku: 300000,
        userId: testSantriUsers[1].id,
      },
    }),
    prisma.santri.create({
      data: {
        nis: "12345680",
        nama: "Santri Pondok Test",
        kelas: "X TKJ 1",
        asrama: "Asrama Putra B",
        wali: faker.person.fullName(),
        status: StatusSantri.AKTIF,
        beasiswa: true,
        jenisBeasiswa: JenisBeasiswa.SYAHRIAH,
        jenisSantri: JenisSantri.PONDOK,
        saldoUangSaku: 200000,
        userId: testSantriUsers[2].id,
      },
    }),
  ]);
  console.log(`✅ Created 3 test santri profiles`);

  // Create Regular Users (Santri)
  console.log("👥 Creating santri users...");
  const santriUsers = [];
  for (let i = 0; i < NUM_USERS - adminUsers.length; i++) {
    const jenisSantri = faker.helpers.arrayElement([JenisSantri.SMK, JenisSantri.SMP, JenisSantri.PONDOK]);
    santriUsers.push({
      id: faker.string.uuid(),
      name: faker.person.fullName({ sex: faker.helpers.arrayElement(["male", "female"]) }),
      email: faker.internet.email().toLowerCase(),
      emailVerified: faker.datatype.boolean(0.8),
      role: Role.SANTRI,
      jenisSantri,
      image: faker.image.avatar(),
    });
  }
  const createdSantriUsers = await prisma.user.createMany({
    data: santriUsers,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdSantriUsers.count} santri users`);

  // Get all santri users
  const allSantriUsers = await prisma.user.findMany({
    where: { role: Role.SANTRI },
  });

  // Create Santri profiles
  console.log("📚 Creating santri profiles...");
  const santriData = [];
  for (let i = 0; i < Math.min(NUM_SANTRI, allSantriUsers.length); i++) {
    const user = allSantriUsers[i];
    let kelas: string;
    
    if (user.jenisSantri === JenisSantri.SMK) {
      kelas = faker.helpers.arrayElement(kelasSMK);
    } else if (user.jenisSantri === JenisSantri.SMP) {
      kelas = faker.helpers.arrayElement(kelasSMP);
    } else {
      kelas = faker.helpers.arrayElement([...kelasSMK, ...kelasSMP]);
    }

    const hasBeasiswa = faker.datatype.boolean(0.2);
    santriData.push({
      nis: generateNIS(),
      nama: user.name,
      kelas,
      asrama: faker.helpers.arrayElement(asramaList),
      wali: faker.person.fullName(),
      status: faker.helpers.arrayElement([StatusSantri.AKTIF, StatusSantri.AKTIF, StatusSantri.AKTIF, StatusSantri.NON_AKTIF]),
      beasiswa: hasBeasiswa,
      jenisBeasiswa: hasBeasiswa ? faker.helpers.arrayElement([JenisBeasiswa.FULL, JenisBeasiswa.SYAHRIAH, JenisBeasiswa.SPP, JenisBeasiswa.UANG_SAKU]) : null,
      jenisSantri: user.jenisSantri!,
      saldoUangSaku: faker.number.int({ min: 0, max: 2000000 }),
      userId: user.id,
    });
  }

  const createdSantri = await prisma.santri.createMany({
    data: santriData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdSantri.count} santri profiles`);

  // Get all santri
  const allSantri = await prisma.santri.findMany();

  // Create Tagihan
  console.log("💰 Creating tagihan...");
  const tagihanData = [];
  const currentYear = new Date().getFullYear();
  
  for (const santri of allSantri) {
    const numTagihan = faker.number.int({ min: 3, max: NUM_TAGIHAN_PER_SANTRI + 3 });
    
    for (let i = 0; i < numTagihan; i++) {
      const bulan = faker.helpers.arrayElement(bulanList);
      const tahun = faker.helpers.arrayElement([currentYear - 1, currentYear]);
      const jenis = faker.helpers.arrayElement([JenisTagihan.SPP, JenisTagihan.SYAHRIAH]);
      
      tagihanData.push({
        kode: generateKodeTagihan(),
        santriId: santri.id,
        jenis,
        bulan,
        tahun,
        jumlah: jenis === JenisTagihan.SPP ? faker.number.int({ min: 300000, max: 800000 }) : faker.number.int({ min: 200000, max: 500000 }),
        status: faker.helpers.arrayElement([StatusTagihan.BELUM_LUNAS, StatusTagihan.LUNAS, StatusTagihan.OVERDUE]),
        jatuhTempo: faker.date.future({ years: 1 }),
      });
    }
  }

  const createdTagihan = await prisma.tagihan.createMany({
    data: tagihanData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdTagihan.count} tagihan`);

  // Create Transaksi
  console.log("💳 Creating transaksi...");
  const transaksiData = [];
  
  for (const santri of allSantri) {
    const numTransaksi = faker.number.int({ min: 5, max: NUM_TRANSAKSI_PER_SANTRI + 5 });
    
    for (let i = 0; i < numTransaksi; i++) {
      const jenis = faker.helpers.arrayElement([
        JenisTransaksi.SPP, 
        JenisTransaksi.SYAHRIAH, 
        JenisTransaksi.UANG_SAKU, 
        JenisTransaksi.LAUNDRY,
        JenisTransaksi.UJIAN,
        JenisTransaksi.PKL,
        JenisTransaksi.LKS,
        JenisTransaksi.BUKU_PENDAMPING,
        JenisTransaksi.TKA
      ]);
      
      const isUangSaku = jenis === JenisTransaksi.UANG_SAKU;
      const isLaundry = jenis === JenisTransaksi.LAUNDRY;
      
      transaksiData.push({
        kode: generateKodeTransaksi(),
        santriId: santri.id,
        jenis,
        bulan: !isUangSaku && !isLaundry ? faker.helpers.arrayElement(bulanList) : null,
        periodePembayaran: faker.helpers.arrayElement([PeriodePembayaran.BULANAN, PeriodePembayaran.TAHUNAN, null]),
        tahun: !isUangSaku && !isLaundry ? faker.helpers.arrayElement([currentYear - 1, currentYear]) : null,
        jumlah: faker.number.int({ min: 50000, max: 1500000 }),
        tanggalBayar: faker.datatype.boolean(0.7) ? faker.date.recent({ days: 90 }) : null,
        status: faker.helpers.arrayElement([StatusTransaksi.LUNAS, StatusTransaksi.PENDING, StatusTransaksi.BELUM_BAYAR, StatusTransaksi.DITOLAK]),
        statusUangSaku: isUangSaku ? faker.helpers.arrayElement([StatusUangSaku.DITAMBAH, StatusUangSaku.DIAMBIL]) : null,
        jenisLaundry: isLaundry ? faker.helpers.arrayElement(jenisLaundryList) : null,
        keterangan: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
        managedBy: faker.helpers.arrayElement([Role.ADMIN, Role.BENDAHARA_SMK, Role.BENDAHARA_SMP, Role.BENDAHARA_PONDOK]),
      });
    }
  }

  const createdTransaksi = await prisma.transaksi.createMany({
    data: transaksiData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdTransaksi.count} transaksi`);

  // Create some Midtrans Transactions
  console.log("🏦 Creating midtrans transactions...");
  const transaksiList = await prisma.transaksi.findMany({
    where: { status: StatusTransaksi.LUNAS },
    take: 30,
  });
  
  const midtransData = transaksiList.map((trx) => ({
    orderId: generateOrderId(),
    transactionId: `MID-${faker.string.alphanumeric(12)}`,
    transaksiId: trx.id,
    grossAmount: trx.jumlah,
    paymentType: faker.helpers.arrayElement(["bank_transfer", "gopay", "shopeepay", "credit_card"]),
    transactionStatus: faker.helpers.arrayElement(["settlement", "capture", "pending"]),
    fraudStatus: faker.helpers.arrayElement(["accept", "challenge", null]),
    transactionTime: faker.date.recent({ days: 30 }),
    settlementTime: faker.datatype.boolean(0.8) ? faker.date.recent({ days: 30 }) : null,
  }));

  const createdMidtrans = await prisma.midtransTransaction.createMany({
    data: midtransData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdMidtrans.count} midtrans transactions`);

  // Create some Sessions
  console.log("🔐 Creating sessions...");
  const allUsers = await prisma.user.findMany({ take: 50 });
  const sessionData = allUsers.map((user) => ({
    id: faker.string.uuid(),
    expiresAt: faker.date.future({ years: 1 }),
    token: faker.string.alphanumeric(32),
    ipAddress: faker.internet.ipv4(),
    userAgent: faker.internet.userAgent(),
    userId: user.id,
  }));

  const createdSessions = await prisma.session.createMany({
    data: sessionData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdSessions.count} sessions`);

  // Create some Accounts
  console.log("🔑 Creating accounts...");
  const hashedDefaultPassword = await hashPassword("password123");
  const accountData = allUsers.map((user) => ({
    id: faker.string.uuid(),
    accountId: faker.string.uuid(),
    providerId: "credential",
    userId: user.id,
    password: hashedDefaultPassword,
  }));

  const createdAccounts = await prisma.account.createMany({
    data: accountData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${createdAccounts.count} accounts`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - Users: ${NUM_USERS}`);
  console.log(`   - Santri: ${NUM_SANTRI}`);
  console.log(`   - Tagihan: ~${NUM_SANTRI * NUM_TAGIHAN_PER_SANTRI}`);
  console.log(`   - Transaksi: ~${NUM_SANTRI * NUM_TRANSAKSI_PER_SANTRI}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
