import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>About ScriptAura</h3>
            <p className={styles.footerText}>
              Empowering students with cutting-edge technology education and
              practical skills for the digital age.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <div className="space-y-2">
              <Link href="/courses" className={styles.footerLink}>
                Our Courses
              </Link>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact
              </Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <p className={styles.footerText}>
              Have questions? We&apos;re here to help!{" "}
              <Link href="/contact" className={styles.contactLink}>
                Get in touch
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.footerDivider}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} ScriptAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
