package ai.openclaw.app.ui

import ai.openclaw.app.GatewayConnectionProblem
import ai.openclaw.app.LocationMode
import ai.openclaw.app.MainViewModel
import ai.openclaw.app.R
import ai.openclaw.app.SensitiveFeatureConfig
import ai.openclaw.app.node.DeviceNotificationListenerService
import ai.openclaw.app.ui.design.ClawDesignTheme
import ai.openclaw.app.ui.design.ClawErrorState
import ai.openclaw.app.ui.design.ClawListItem
import ai.openclaw.app.ui.design.ClawPanel
import ai.openclaw.app.ui.design.ClawPrimaryButton
import ai.openclaw.app.ui.design.ClawScaffold
import ai.openclaw.app.ui.design.ClawStatus
import ai.openclaw.app.ui.design.ClawStatusPill
import ai.openclaw.app.ui.design.ClawTextField
import ai.openclaw.app.ui.design.ClawTheme
import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorManager
import android.os.Build
import android.os.SystemClock
import android.provider.Settings
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCode2
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.WifiTethering
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
<<<<<<< HEAD
import ai.openclaw.app.BuildConfig
import ai.openclaw.app.LocationMode
import ai.openclaw.app.MainViewModel
import ai.openclaw.app.gateway.GatewayEndpoint
import ai.openclaw.app.node.DeviceNotificationListenerService
=======
>>>>>>> upstream/main
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import kotlinx.coroutines.delay

private enum class OnboardingStep {
  Welcome,
  Gateway,
  Recovery,
  Permissions,
}

private const val GATEWAY_CONNECT_SETTLING_MS = 2_500L

/** First-run Android onboarding flow for gateway pairing and permission setup. */
@Composable
fun OnboardingFlow(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier,
) {
  val appearanceThemeMode by viewModel.appearanceThemeMode.collectAsState()
  val onboardingDark = appearanceThemeMode.isDark(systemDark = isSystemInDarkTheme())
  ClawDesignTheme(dark = onboardingDark) {
    val context = LocalContext.current
    val statusText by viewModel.statusText.collectAsState()
    val gatewayConnectionProblem by viewModel.gatewayConnectionProblem.collectAsState()
    val isConnected by viewModel.isConnected.collectAsState()
    val isNodeConnected by viewModel.isNodeConnected.collectAsState()
    val runtimeInitialized by viewModel.runtimeInitialized.collectAsState()
    val serverName by viewModel.serverName.collectAsState()
    val remoteAddress by viewModel.remoteAddress.collectAsState()
    val gateways by viewModel.gateways.collectAsState()
    val discoveryStatusText by viewModel.discoveryStatusText.collectAsState()
    val savedToken by viewModel.gatewayToken.collectAsState()
    val pendingTrust by viewModel.pendingGatewayTrust.collectAsState()
    val startAtGatewaySetup by viewModel.startOnboardingAtGatewaySetup.collectAsState()
    val ready = canFinishOnboarding(isConnected = isConnected, isNodeConnected = isNodeConnected)

    var step by rememberSaveable { mutableStateOf(OnboardingStep.Welcome) }
    var setupCode by rememberSaveable { mutableStateOf("") }
    var manualHost by rememberSaveable { mutableStateOf("127.0.0.1") }
    var manualPort by rememberSaveable { mutableStateOf("18789") }
    var manualTls by rememberSaveable { mutableStateOf(false) }
    var token by rememberSaveable { mutableStateOf(savedToken) }
    var password by rememberSaveable { mutableStateOf("") }
    var setupError by rememberSaveable { mutableStateOf<String?>(null) }
    var attemptedConnect by rememberSaveable { mutableStateOf(false) }
    var attemptedGatewayName by rememberSaveable { mutableStateOf<String?>(null) }
    var connectAttemptStartedAtMs by rememberSaveable { mutableLongStateOf(0L) }
    var recoveryNowMs by remember { mutableLongStateOf(SystemClock.elapsedRealtime()) }

    OpenClawSystemBarAppearance(lightAppearance = !onboardingDark && step != OnboardingStep.Welcome)

    val qrScannerOptions =
      remember {
        GmsBarcodeScannerOptions
          .Builder()
          .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
          .build()
      }
    val qrScanner = remember(context, qrScannerOptions) { GmsBarcodeScanning.getClient(context, qrScannerOptions) }

    val permissionState = rememberPermissionState(context = context, viewModel = viewModel)

    LaunchedEffect(startAtGatewaySetup) {
      if (startAtGatewaySetup) {
        step = OnboardingStep.Gateway
        viewModel.clearGatewaySetupStartRequest()
      }
    }

    LaunchedEffect(step) {
      if (step == OnboardingStep.Gateway) {
        viewModel.startGatewayDiscovery()
      }
    }

    LaunchedEffect(ready, attemptedConnect) {
      if (attemptedConnect && ready) {
        step = OnboardingStep.Permissions
      }
    }

    LaunchedEffect(step, connectAttemptStartedAtMs) {
      if (step != OnboardingStep.Recovery || connectAttemptStartedAtMs <= 0L) return@LaunchedEffect
      recoveryNowMs = SystemClock.elapsedRealtime()
      delay(GATEWAY_CONNECT_SETTLING_MS)
      recoveryNowMs = SystemClock.elapsedRealtime()
    }

    pendingTrust?.let { prompt ->
      AlertDialog(
        onDismissRequest = viewModel::declineGatewayTrustPrompt,
        containerColor = ClawTheme.colors.surfaceRaised,
        title = { Text("Trust this gateway?", style = ClawTheme.type.section, color = ClawTheme.colors.text) },
        text = {
          Text(
            "Verify the certificate fingerprint before continuing.\n\n${prompt.fingerprintSha256}",
            style = ClawTheme.type.body,
            color = ClawTheme.colors.textMuted,
          )
        },
        confirmButton = {
          TextButton(onClick = viewModel::acceptGatewayTrustPrompt) {
            Text("Trust")
          }
        },
        dismissButton = {
          TextButton(onClick = viewModel::declineGatewayTrustPrompt) {
            Text("Cancel")
          }
        },
      )
    }

    when (step) {
      OnboardingStep.Welcome ->
        ClawDesignTheme(dark = true) {
          WelcomeScreen(
            modifier = modifier,
            onConnect = { step = OnboardingStep.Gateway },
          )
        }
      OnboardingStep.Gateway ->
        GatewaySetupScreen(
          modifier = modifier,
          setupCode = setupCode,
          manualHost = manualHost,
          manualPort = manualPort,
          manualTls = manualTls,
          token = token,
          password = password,
          nearbyGatewayName = gateways.firstOrNull()?.name,
          discoveryStatusText = discoveryStatusText,
          discoveryStarted = runtimeInitialized,
          error = setupError,
          onBack = { step = OnboardingStep.Welcome },
          onScan = {
            setupError = null
            qrScanner
              .startScan()
              .addOnSuccessListener { barcode ->
                val scanned = resolveScannedSetupCodeResult(barcode.rawValue.orEmpty())
                if (scanned.setupCode == null) {
                  setupError =
                    gatewayEndpointValidationMessage(
                      scanned.error ?: GatewayEndpointValidationError.INVALID_URL,
                      GatewayEndpointInputSource.QR_SCAN,
                    )
                  return@addOnSuccessListener
                }
                setupCode = scanned.setupCode
              }.addOnFailureListener { setupError = "Could not open the scanner." }
          },
          onSetupCodeChange = {
            setupCode = it
            setupError = null
          },
          onManualHostChange = {
            manualHost = it
            setupError = null
          },
          onManualPortChange = {
            manualPort = it
            setupError = null
          },
          onManualTlsChange = { manualTls = it },
          onTokenChange = { token = it },
          onPasswordChange = { password = it },
          onUseNearby = {
            val endpoint = gateways.firstOrNull() ?: return@GatewaySetupScreen
            attemptedGatewayName = endpoint.name
            attemptedConnect = true
            connectAttemptStartedAtMs = SystemClock.elapsedRealtime()
            viewModel.connectInBackground(endpoint)
            step = OnboardingStep.Recovery
          },
          onPair = {
            val config =
              resolveGatewayConfig(
                setupCode = setupCode,
                manualHost = manualHost,
                manualPort = manualPort,
                manualTls = manualTls,
                token = token,
                password = password,
              )
            if (config == null) {
              setupError = "Enter a setup code or a valid gateway URL."
              return@GatewaySetupScreen
            }

            setupError = null
            attemptedGatewayName = null
            attemptedConnect = true
            connectAttemptStartedAtMs = SystemClock.elapsedRealtime()
            viewModel.saveGatewayConfigAndConnect(
              host = config.host,
              port = config.port,
              tls = config.tls,
              token = config.token,
              bootstrapToken = config.bootstrapToken,
              password = config.password,
              resetSetupAuth = true,
            )
            step = OnboardingStep.Recovery
          },
        )
      OnboardingStep.Recovery ->
        GatewayRecoveryScreen(
          modifier = modifier,
          statusText = statusText,
          serverName = serverName,
          attemptedGatewayName = attemptedGatewayName,
          remoteAddress = remoteAddress,
          ready = ready,
          gatewayConnectionProblem = gatewayConnectionProblem,
          connectSettling = recoveryNowMs - connectAttemptStartedAtMs < GATEWAY_CONNECT_SETTLING_MS,
          onBack = { step = OnboardingStep.Gateway },
          onRetry = {
            attemptedConnect = true
            connectAttemptStartedAtMs = SystemClock.elapsedRealtime()
            val config =
              resolveGatewayConfig(
                setupCode = setupCode,
                manualHost = manualHost,
                manualPort = manualPort,
                manualTls = manualTls,
                token = token,
                password = password,
              ) ?: return@GatewayRecoveryScreen
            viewModel.saveGatewayConfigAndConnect(
              host = config.host,
              port = config.port,
              tls = config.tls,
              token = config.token,
              bootstrapToken = config.bootstrapToken,
              password = config.password,
              resetSetupAuth = false,
            )
          },
          onEdit = { step = OnboardingStep.Gateway },
          onContinue = { step = OnboardingStep.Permissions },
        )
      OnboardingStep.Permissions ->
        PermissionSetupScreen(
          modifier = modifier,
          permissionState = permissionState,
          onBack = { step = OnboardingStep.Gateway },
          onContinue = {
            permissionState.applyToViewModel()
            viewModel.setOnboardingCompleted(true)
          },
        )
    }
  }
}

@Composable
<<<<<<< HEAD
fun OnboardingFlow(viewModel: MainViewModel, modifier: Modifier = Modifier) {
  val context = androidx.compose.ui.platform.LocalContext.current
  val statusText by viewModel.statusText.collectAsState()
  val isConnected by viewModel.isConnected.collectAsState()
  val isNodeConnected by viewModel.isNodeConnected.collectAsState()
  val serverName by viewModel.serverName.collectAsState()
  val remoteAddress by viewModel.remoteAddress.collectAsState()
  val persistedGatewayToken by viewModel.gatewayToken.collectAsState()
  val pendingTrust by viewModel.pendingGatewayTrust.collectAsState()

  var step by rememberSaveable { mutableStateOf(OnboardingStep.Welcome) }
  var setupCode by rememberSaveable { mutableStateOf("") }
  var gatewayUrl by rememberSaveable { mutableStateOf("") }
  var gatewayPassword by rememberSaveable { mutableStateOf("") }
  var gatewayInputMode by rememberSaveable { mutableStateOf(GatewayInputMode.SetupCode) }
  var gatewayAdvancedOpen by rememberSaveable { mutableStateOf(false) }
  var manualHost by rememberSaveable { mutableStateOf("10.0.2.2") }
  var manualPort by rememberSaveable { mutableStateOf("18789") }
  var manualTls by rememberSaveable { mutableStateOf(false) }
  var gatewayError by rememberSaveable { mutableStateOf<String?>(null) }
  var attemptedConnect by rememberSaveable { mutableStateOf(false) }
  val canFinishOnboarding = canFinishOnboarding(isConnected = isConnected, isNodeConnected = isNodeConnected)

  val lifecycleOwner = LocalLifecycleOwner.current
  val qrScannerOptions =
    remember {
      GmsBarcodeScannerOptions.Builder()
        .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
        .build()
    }
  val qrScanner = remember(context, qrScannerOptions) { GmsBarcodeScanning.getClient(context, qrScannerOptions) }

  val smsAvailable =
    remember(context) {
      BuildConfig.OPENCLAW_ENABLE_SMS &&
        context.packageManager?.hasSystemFeature(PackageManager.FEATURE_TELEPHONY) == true
    }
  val callLogAvailable = remember { BuildConfig.OPENCLAW_ENABLE_CALL_LOG }
  val motionAvailable =
    remember(context) {
      hasMotionCapabilities(context)
    }
  val motionPermissionRequired = true
  val notificationsPermissionRequired = Build.VERSION.SDK_INT >= 33
  val discoveryPermission =
    if (Build.VERSION.SDK_INT >= 33) {
      Manifest.permission.NEARBY_WIFI_DEVICES
    } else {
      Manifest.permission.ACCESS_FINE_LOCATION
    }
  val photosPermission =
    if (Build.VERSION.SDK_INT >= 33) {
      Manifest.permission.READ_MEDIA_IMAGES
    } else {
      Manifest.permission.READ_EXTERNAL_STORAGE
    }

  var enableDiscovery by
    rememberSaveable {
      mutableStateOf(isPermissionGranted(context, discoveryPermission))
    }
  var enableLocation by rememberSaveable { mutableStateOf(false) }
  var enableNotifications by
    rememberSaveable {
      mutableStateOf(
        !notificationsPermissionRequired ||
          isPermissionGranted(context, Manifest.permission.POST_NOTIFICATIONS),
      )
    }
  var enableNotificationListener by
    rememberSaveable {
      mutableStateOf(isNotificationListenerEnabled(context))
    }
  var enableMicrophone by rememberSaveable { mutableStateOf(false) }
  var enableCamera by rememberSaveable { mutableStateOf(false) }
  var enablePhotos by rememberSaveable { mutableStateOf(false) }
  var enableContacts by rememberSaveable { mutableStateOf(false) }
  var enableCalendar by rememberSaveable { mutableStateOf(false) }
  var enableMotion by
    rememberSaveable {
      mutableStateOf(
        motionAvailable &&
          (!motionPermissionRequired || isPermissionGranted(context, Manifest.permission.ACTIVITY_RECOGNITION)),
      )
    }
  var enableSms by
    rememberSaveable {
      mutableStateOf(
        smsAvailable &&
                isPermissionGranted(context, Manifest.permission.SEND_SMS) &&
                isPermissionGranted(context, Manifest.permission.READ_SMS)
      )
    }
  var enableCallLog by
    rememberSaveable {
      mutableStateOf(callLogAvailable && isPermissionGranted(context, Manifest.permission.READ_CALL_LOG))
    }

  var pendingPermissionToggle by remember { mutableStateOf<PermissionToggle?>(null) }
  var pendingSpecialAccessToggle by remember { mutableStateOf<SpecialAccessToggle?>(null) }

  fun setPermissionToggleEnabled(toggle: PermissionToggle, enabled: Boolean) {
    when (toggle) {
      PermissionToggle.Discovery -> enableDiscovery = enabled
      PermissionToggle.Location -> enableLocation = enabled
      PermissionToggle.Notifications -> enableNotifications = enabled
      PermissionToggle.Microphone -> enableMicrophone = enabled
      PermissionToggle.Camera -> enableCamera = enabled
      PermissionToggle.Photos -> enablePhotos = enabled
      PermissionToggle.Contacts -> enableContacts = enabled
      PermissionToggle.Calendar -> enableCalendar = enabled
      PermissionToggle.Motion -> enableMotion = enabled && motionAvailable
      PermissionToggle.Sms -> enableSms = enabled && smsAvailable
      PermissionToggle.CallLog -> enableCallLog = enabled && callLogAvailable
    }
  }

  fun isPermissionToggleGranted(toggle: PermissionToggle): Boolean =
    when (toggle) {
      PermissionToggle.Discovery -> isPermissionGranted(context, discoveryPermission)
      PermissionToggle.Location ->
        isPermissionGranted(context, Manifest.permission.ACCESS_FINE_LOCATION) ||
          isPermissionGranted(context, Manifest.permission.ACCESS_COARSE_LOCATION)
      PermissionToggle.Notifications ->
        !notificationsPermissionRequired ||
          isPermissionGranted(context, Manifest.permission.POST_NOTIFICATIONS)
      PermissionToggle.Microphone -> isPermissionGranted(context, Manifest.permission.RECORD_AUDIO)
      PermissionToggle.Camera -> isPermissionGranted(context, Manifest.permission.CAMERA)
      PermissionToggle.Photos -> isPermissionGranted(context, photosPermission)
      PermissionToggle.Contacts ->
        isPermissionGranted(context, Manifest.permission.READ_CONTACTS) &&
          isPermissionGranted(context, Manifest.permission.WRITE_CONTACTS)
      PermissionToggle.Calendar ->
        isPermissionGranted(context, Manifest.permission.READ_CALENDAR) &&
          isPermissionGranted(context, Manifest.permission.WRITE_CALENDAR)
      PermissionToggle.Motion ->
        !motionAvailable ||
          !motionPermissionRequired ||
          isPermissionGranted(context, Manifest.permission.ACTIVITY_RECOGNITION)
      PermissionToggle.Sms ->
        !smsAvailable ||
                (isPermissionGranted(context, Manifest.permission.SEND_SMS) &&
                        isPermissionGranted(context, Manifest.permission.READ_SMS))
      PermissionToggle.CallLog ->
        !callLogAvailable || isPermissionGranted(context, Manifest.permission.READ_CALL_LOG)
    }

  fun setSpecialAccessToggleEnabled(toggle: SpecialAccessToggle, enabled: Boolean) {
    when (toggle) {
      SpecialAccessToggle.NotificationListener -> enableNotificationListener = enabled
    }
  }

  val enabledPermissionSummary =
    remember(
      enableDiscovery,
      enableLocation,
      enableNotifications,
      enableNotificationListener,
      enableMicrophone,
      enableCamera,
      enablePhotos,
      enableContacts,
      enableCalendar,
      enableMotion,
      enableSms,
      enableCallLog,
      smsAvailable,
      callLogAvailable,
      motionAvailable,
    ) {
      val enabled = mutableListOf<String>()
      if (enableDiscovery) enabled += "Gateway discovery"
      if (enableLocation) enabled += "Location"
      if (enableNotifications) enabled += "Notifications"
      if (enableNotificationListener) enabled += "Notification listener"
      if (enableMicrophone) enabled += "Microphone"
      if (enableCamera) enabled += "Camera"
      if (enablePhotos) enabled += "Photos"
      if (enableContacts) enabled += "Contacts"
      if (enableCalendar) enabled += "Calendar"
      if (enableMotion && motionAvailable) enabled += "Motion"
      if (smsAvailable && enableSms) enabled += "SMS"
      if (callLogAvailable && enableCallLog) enabled += "Call Log"
      if (enabled.isEmpty()) "None selected" else enabled.joinToString(", ")
    }

  val proceedFromPermissions: () -> Unit = proceed@{
    var openedSpecialSetup = false
    if (enableNotificationListener && !isNotificationListenerEnabled(context)) {
      openNotificationListenerSettings(context)
      openedSpecialSetup = true
    }
    if (openedSpecialSetup) {
      return@proceed
    }
    step = OnboardingStep.FinalCheck
  }

  val togglePermissionLauncher =
    rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
      val pendingToggle = pendingPermissionToggle ?: return@rememberLauncherForActivityResult
      setPermissionToggleEnabled(pendingToggle, isPermissionToggleGranted(pendingToggle))
      pendingPermissionToggle = null
    }

  val requestPermissionToggle: (PermissionToggle, Boolean, List<String>) -> Unit =
    request@{ toggle, enabled, permissions ->
      if (!enabled) {
        setPermissionToggleEnabled(toggle, false)
        return@request
      }
      if (isPermissionToggleGranted(toggle)) {
        setPermissionToggleEnabled(toggle, true)
        return@request
      }
      val missing = permissions.distinct().filterNot { isPermissionGranted(context, it) }
      if (missing.isEmpty()) {
        setPermissionToggleEnabled(toggle, isPermissionToggleGranted(toggle))
        return@request
      }
      pendingPermissionToggle = toggle
      togglePermissionLauncher.launch(missing.toTypedArray())
    }

  val requestSpecialAccessToggle: (SpecialAccessToggle, Boolean) -> Unit =
    request@{ toggle, enabled ->
      if (!enabled) {
        setSpecialAccessToggleEnabled(toggle, false)
        pendingSpecialAccessToggle = null
        return@request
      }
      val grantedNow =
        when (toggle) {
          SpecialAccessToggle.NotificationListener -> isNotificationListenerEnabled(context)
        }
      if (grantedNow) {
        setSpecialAccessToggleEnabled(toggle, true)
        pendingSpecialAccessToggle = null
        return@request
      }
      pendingSpecialAccessToggle = toggle
      when (toggle) {
        SpecialAccessToggle.NotificationListener -> openNotificationListenerSettings(context)
      }
    }

  DisposableEffect(lifecycleOwner, context, pendingSpecialAccessToggle) {
    val observer =
      LifecycleEventObserver { _, event ->
        if (event != Lifecycle.Event.ON_RESUME) {
          return@LifecycleEventObserver
        }
        when (pendingSpecialAccessToggle) {
          SpecialAccessToggle.NotificationListener -> {
            setSpecialAccessToggleEnabled(
              SpecialAccessToggle.NotificationListener,
              isNotificationListenerEnabled(context),
            )
            pendingSpecialAccessToggle = null
          }
          null -> Unit
        }
      }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
  }

  if (pendingTrust != null) {
    val prompt = pendingTrust!!
    AlertDialog(
      onDismissRequest = { viewModel.declineGatewayTrustPrompt() },
      containerColor = onboardingSurface,
      title = { Text("Trust this gateway?", style = onboardingHeadlineStyle, color = onboardingText) },
      text = {
        Text(
          "First-time TLS connection.\n\nVerify this SHA-256 fingerprint before trusting:\n${prompt.fingerprintSha256}",
          style = onboardingCalloutStyle,
          color = onboardingText,
        )
      },
      confirmButton = {
        TextButton(
          onClick = { viewModel.acceptGatewayTrustPrompt() },
          colors = ButtonDefaults.textButtonColors(contentColor = onboardingAccent),
        ) {
          Text("Trust and continue")
        }
      },
      dismissButton = {
        TextButton(
          onClick = { viewModel.declineGatewayTrustPrompt() },
          colors = ButtonDefaults.textButtonColors(contentColor = onboardingTextSecondary),
        ) {
          Text("Cancel")
        }
      },
=======
private fun WelcomeScreen(
  onConnect: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val welcomeBackground =
    Brush.verticalGradient(
      colors =
        listOf(
          Color(0xFFFF4D4D),
          Color(0xFFD73332),
          Color(0xFF991B1B),
          Color(0xFF260707),
        ),
>>>>>>> upstream/main
    )

  Box(
    modifier =
      modifier
        .fillMaxSize()
        .background(welcomeBackground)
        .windowInsetsPadding(WindowInsets.safeDrawing)
        .padding(horizontal = 24.dp, vertical = 18.dp),
  ) {
    Column(
      modifier = Modifier.fillMaxSize(),
      horizontalAlignment = Alignment.CenterHorizontally,
    ) {
<<<<<<< HEAD
      Column(
        modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp),
      ) {
        Column(
          modifier = Modifier.padding(top = 12.dp),
          verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
          Text(
            "OpenClaw",
            style = onboardingDisplayStyle,
            color = onboardingText,
          )
          Text(
            "Mobile Setup",
            style = onboardingTitle1Style,
            color = onboardingTextSecondary,
          )
        }
        StepRail(current = step)

        when (step) {
          OnboardingStep.Welcome -> WelcomeStep()
          OnboardingStep.Gateway ->
            GatewayStep(
              inputMode = gatewayInputMode,
              advancedOpen = gatewayAdvancedOpen,
              setupCode = setupCode,
              manualHost = manualHost,
              manualPort = manualPort,
              manualTls = manualTls,
              gatewayToken = persistedGatewayToken,
              gatewayPassword = gatewayPassword,
              gatewayError = gatewayError,
              onScanQrClick = {
                gatewayError = null
                qrScanner.startScan()
                  .addOnSuccessListener { barcode ->
                    val contents = barcode.rawValue?.trim().orEmpty()
                    if (contents.isEmpty()) {
                      return@addOnSuccessListener
                    }
                    val scannedSetupCode = resolveScannedSetupCodeResult(contents)
                    if (scannedSetupCode.setupCode == null) {
                      gatewayError =
                        gatewayEndpointValidationMessage(
                          scannedSetupCode.error ?: GatewayEndpointValidationError.INVALID_URL,
                          GatewayEndpointInputSource.QR_SCAN,
                        )
                      return@addOnSuccessListener
                    }
                    setupCode = scannedSetupCode.setupCode
                    gatewayInputMode = GatewayInputMode.SetupCode
                    gatewayError = null
                    attemptedConnect = false
                  }
                  .addOnCanceledListener {
                    // User dismissed the scanner; preserve current form state.
                  }
                  .addOnFailureListener {
                    gatewayError = qrScannerErrorMessage()
                  }
              },
              onAdvancedOpenChange = { gatewayAdvancedOpen = it },
              onInputModeChange = {
                gatewayInputMode = it
                gatewayError = null
              },
              onSetupCodeChange = {
                setupCode = it
                gatewayError = null
              },
              onManualHostChange = {
                manualHost = it
                gatewayError = null
              },
              onManualPortChange = {
                manualPort = it
                gatewayError = null
              },
              onManualTlsChange = { manualTls = it },
              onTokenChange = viewModel::setGatewayToken,
              onPasswordChange = { gatewayPassword = it },
            )
          OnboardingStep.Permissions ->
            PermissionsStep(
              enableDiscovery = enableDiscovery,
              enableLocation = enableLocation,
              enableNotifications = enableNotifications,
              enableNotificationListener = enableNotificationListener,
              enableMicrophone = enableMicrophone,
              enableCamera = enableCamera,
              enablePhotos = enablePhotos,
              enableContacts = enableContacts,
              enableCalendar = enableCalendar,
              enableMotion = enableMotion,
              motionAvailable = motionAvailable,
              motionPermissionRequired = motionPermissionRequired,
              enableSms = enableSms,
              smsAvailable = smsAvailable,
              callLogAvailable = callLogAvailable,
              enableCallLog = enableCallLog,
              context = context,
              onDiscoveryChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Discovery,
                  checked,
                  listOf(discoveryPermission),
                )
              },
              onLocationChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Location,
                  checked,
                  listOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                  ),
                )
              },
              onNotificationsChange = { checked ->
                if (!notificationsPermissionRequired) {
                  setPermissionToggleEnabled(PermissionToggle.Notifications, checked)
                } else {
                  requestPermissionToggle(
                    PermissionToggle.Notifications,
                    checked,
                    listOf(Manifest.permission.POST_NOTIFICATIONS),
                  )
                }
              },
              onNotificationListenerChange = { checked ->
                requestSpecialAccessToggle(SpecialAccessToggle.NotificationListener, checked)
              },
              onMicrophoneChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Microphone,
                  checked,
                  listOf(Manifest.permission.RECORD_AUDIO),
                )
              },
              onCameraChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Camera,
                  checked,
                  listOf(Manifest.permission.CAMERA),
                )
              },
              onPhotosChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Photos,
                  checked,
                  listOf(photosPermission),
                )
              },
              onContactsChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Contacts,
                  checked,
                  listOf(
                    Manifest.permission.READ_CONTACTS,
                    Manifest.permission.WRITE_CONTACTS,
                  ),
                )
              },
              onCalendarChange = { checked ->
                requestPermissionToggle(
                  PermissionToggle.Calendar,
                  checked,
                  listOf(
                    Manifest.permission.READ_CALENDAR,
                    Manifest.permission.WRITE_CALENDAR,
                  ),
                )
              },
              onMotionChange = { checked ->
                if (!motionAvailable) {
                  setPermissionToggleEnabled(PermissionToggle.Motion, false)
                } else if (!motionPermissionRequired) {
                  setPermissionToggleEnabled(PermissionToggle.Motion, checked)
                } else {
                  requestPermissionToggle(
                    PermissionToggle.Motion,
                    checked,
                    listOf(Manifest.permission.ACTIVITY_RECOGNITION),
                  )
                }
              },
              onSmsChange = { checked ->
                if (!smsAvailable) {
                  setPermissionToggleEnabled(PermissionToggle.Sms, false)
                } else {
                  requestPermissionToggle(
                    PermissionToggle.Sms,
                    checked,
                    listOf(Manifest.permission.SEND_SMS, Manifest.permission.READ_SMS),
                  )
                }
              },
              onCallLogChange = { checked ->
                if (!callLogAvailable) {
                  setPermissionToggleEnabled(PermissionToggle.CallLog, false)
                } else {
                  requestPermissionToggle(
                    PermissionToggle.CallLog,
                    checked,
                    listOf(Manifest.permission.READ_CALL_LOG),
                  )
                }
              },
            )
          OnboardingStep.FinalCheck ->
            FinalStep(
              parsedGateway = parseGatewayEndpoint(gatewayUrl),
              statusText = statusText,
              isConnected = canFinishOnboarding,
              serverName = serverName,
              remoteAddress = remoteAddress,
              attemptedConnect = attemptedConnect,
              enabledPermissions = enabledPermissionSummary,
              methodLabel = if (gatewayInputMode == GatewayInputMode.SetupCode) "QR / Setup Code" else "Manual",
            )
        }
      }

      Spacer(Modifier.height(12.dp))

      Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
      ) {
        val backEnabled = step != OnboardingStep.Welcome
        Surface(
          modifier = Modifier.size(52.dp),
          shape = RoundedCornerShape(14.dp),
          color = onboardingSurface,
          border = androidx.compose.foundation.BorderStroke(1.dp, if (backEnabled) onboardingBorderStrong else onboardingBorder),
        ) {
          IconButton(
            onClick = {
              step =
                when (step) {
                  OnboardingStep.Welcome -> OnboardingStep.Welcome
                  OnboardingStep.Gateway -> OnboardingStep.Welcome
                  OnboardingStep.Permissions -> OnboardingStep.Gateway
                  OnboardingStep.FinalCheck -> OnboardingStep.Permissions
                }
            },
            enabled = backEnabled,
          ) {
            Icon(
              Icons.AutoMirrored.Filled.ArrowBack,
              contentDescription = "Back",
              tint = if (backEnabled) onboardingTextSecondary else onboardingTextTertiary,
            )
          }
        }

        when (step) {
          OnboardingStep.Welcome -> {
            Button(
              onClick = { step = OnboardingStep.Gateway },
              modifier = Modifier.weight(1f).height(52.dp),
              shape = RoundedCornerShape(14.dp),
              colors = onboardingPrimaryButtonColors(),
            ) {
              Text("Next", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
            }
          }
          OnboardingStep.Gateway -> {
            Button(
              onClick = {
                if (gatewayInputMode == GatewayInputMode.SetupCode) {
                  val parsedSetup = decodeGatewaySetupCode(setupCode)
                  if (parsedSetup == null) {
                    gatewayError = "Scan QR code first, or use Advanced setup."
                    return@Button
                  }
                  val parsedGateway = parseGatewayEndpointResult(parsedSetup.url)
                  if (parsedGateway.config == null) {
                    gatewayError =
                      gatewayEndpointValidationMessage(
                        parsedGateway.error ?: GatewayEndpointValidationError.INVALID_URL,
                        GatewayEndpointInputSource.SETUP_CODE,
                      )
                    return@Button
                  }
                  gatewayUrl = parsedSetup.url
                  viewModel.setGatewayBootstrapToken(parsedSetup.bootstrapToken.orEmpty())
                  val sharedToken = parsedSetup.token.orEmpty().trim()
                  val password = parsedSetup.password.orEmpty().trim()
                  if (sharedToken.isNotEmpty()) {
                    viewModel.setGatewayToken(sharedToken)
                  } else if (!parsedSetup.bootstrapToken.isNullOrBlank()) {
                    viewModel.setGatewayToken("")
                  }
                  gatewayPassword = password
                  if (password.isEmpty() && !parsedSetup.bootstrapToken.isNullOrBlank()) {
                    viewModel.setGatewayPassword("")
                  }
                } else {
                  val manualUrl = composeGatewayManualUrl(manualHost, manualPort, manualTls)
                  val parsedGateway = manualUrl?.let(::parseGatewayEndpointResult)
                  if (parsedGateway?.config == null) {
                    gatewayError =
                      gatewayEndpointValidationMessage(
                        parsedGateway?.error ?: GatewayEndpointValidationError.INVALID_URL,
                        GatewayEndpointInputSource.MANUAL,
                      )
                    return@Button
                  }
                  gatewayUrl = parsedGateway.config.displayUrl
                  viewModel.setGatewayBootstrapToken("")
                }
                step = OnboardingStep.Permissions
              },
              modifier = Modifier.weight(1f).height(52.dp),
              shape = RoundedCornerShape(14.dp),
              colors = onboardingPrimaryButtonColors(),
            ) {
              Text("Next", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
            }
          }
          OnboardingStep.Permissions -> {
            Button(
              onClick = {
                viewModel.setCameraEnabled(enableCamera)
                viewModel.setLocationMode(if (enableLocation) LocationMode.WhileUsing else LocationMode.Off)
                proceedFromPermissions()
              },
              modifier = Modifier.weight(1f).height(52.dp),
              shape = RoundedCornerShape(14.dp),
              colors = onboardingPrimaryButtonColors(),
            ) {
              Text("Next", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
            }
          }
          OnboardingStep.FinalCheck -> {
            if (canFinishOnboarding) {
              Button(
                onClick = { viewModel.setOnboardingCompleted(true) },
                modifier = Modifier.weight(1f).height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = onboardingPrimaryButtonColors(),
              ) {
                Text("Finish", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
              }
            } else {
              Button(
                onClick = {
                  val parsed = parseGatewayEndpointResult(gatewayUrl)
                  if (parsed.config == null) {
                    step = OnboardingStep.Gateway
                    gatewayError =
                      gatewayEndpointValidationMessage(
                        parsed.error ?: GatewayEndpointValidationError.INVALID_URL,
                        GatewayEndpointInputSource.MANUAL,
                      )
                    return@Button
                  }
                  val token = persistedGatewayToken.trim()
                  val password = gatewayPassword.trim()
                  attemptedConnect = true
                  viewModel.setManualEnabled(true)
                  viewModel.setManualHost(parsed.config.host)
                  viewModel.setManualPort(parsed.config.port)
                  viewModel.setManualTls(parsed.config.tls)
                  if (gatewayInputMode == GatewayInputMode.Manual) {
                    viewModel.setGatewayBootstrapToken("")
                  }
                  if (token.isNotEmpty()) {
                    viewModel.setGatewayToken(token)
                  } else {
                    viewModel.setGatewayToken("")
                  }
                  viewModel.setGatewayPassword(password)
                  viewModel.connect(
                    GatewayEndpoint.manual(host = parsed.config.host, port = parsed.config.port),
                    token = token.ifEmpty { null },
                    bootstrapToken =
                      if (gatewayInputMode == GatewayInputMode.SetupCode) {
                        decodeGatewaySetupCode(setupCode)?.bootstrapToken?.trim()?.ifEmpty { null }
                      } else {
                        null
                      },
                    password = password.ifEmpty { null },
                  )
                },
                modifier = Modifier.weight(1f).height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = onboardingPrimaryButtonColors(),
              ) {
                Text("Connect", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
              }
            }
          }
        }
      }
    }
  }
}

internal fun canFinishOnboarding(isConnected: Boolean, isNodeConnected: Boolean): Boolean {
  return isConnected && isNodeConnected
}

@Composable
private fun onboardingPrimaryButtonColors() =
  ButtonDefaults.buttonColors(
    containerColor = onboardingAccent,
    contentColor = Color.White,
    disabledContainerColor = onboardingAccent.copy(alpha = 0.45f),
    disabledContentColor = Color.White.copy(alpha = 0.9f),
  )

@Composable
private fun onboardingTextFieldColors() =
  OutlinedTextFieldDefaults.colors(
    focusedContainerColor = onboardingSurface,
    unfocusedContainerColor = onboardingSurface,
    focusedBorderColor = onboardingAccent,
    unfocusedBorderColor = onboardingBorder,
    focusedTextColor = onboardingText,
    unfocusedTextColor = onboardingText,
    cursorColor = onboardingAccent,
  )

@Composable
private fun onboardingSwitchColors() =
  SwitchDefaults.colors(
    checkedTrackColor = onboardingAccent,
    uncheckedTrackColor = onboardingBorderStrong,
    checkedThumbColor = Color.White,
    uncheckedThumbColor = Color.White,
  )

@Composable
private fun StepRail(current: OnboardingStep) {
  val steps = OnboardingStep.entries
  Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
    steps.forEach { step ->
      val complete = step.index < current.index
      val active = step.index == current.index
      Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
      ) {
        Box(
          modifier =
            Modifier
              .fillMaxWidth()
              .height(5.dp)
              .background(
                color =
                  when {
                    complete -> onboardingSuccess
                    active -> onboardingAccent
                    else -> onboardingBorder
                  },
                shape = RoundedCornerShape(999.dp),
              ),
=======
      Spacer(modifier = Modifier.height(96.dp))
      Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(18.dp)) {
        WelcomeLogo()
        Text(
          text = "OPENCLAW",
          style = ClawTheme.type.display.copy(fontSize = 34.sp, lineHeight = 38.sp, fontWeight = FontWeight.Black),
          color = ClawTheme.colors.text,
>>>>>>> upstream/main
        )
        Text(
          text = "Your personal AI assistant.\nExfoliate! Exfoliate!",
          style = ClawTheme.type.section,
          color = ClawTheme.colors.text,
          textAlign = TextAlign.Center,
        )
      }
      Spacer(modifier = Modifier.weight(1f))
      WelcomeHorizon()
      Spacer(modifier = Modifier.height(30.dp))
      Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        HeroPrimaryAction(title = "Connect Gateway", onClick = onConnect)
      }
      Spacer(modifier = Modifier.height(104.dp))
    }
  }
}

@Composable
private fun WelcomeLogo() {
  Surface(
    modifier = Modifier.size(82.dp),
    shape = CircleShape,
    color = Color.White.copy(alpha = 0.92f),
    contentColor = Color.Unspecified,
  ) {
    Box(modifier = Modifier.fillMaxSize().padding(12.dp), contentAlignment = Alignment.Center) {
      Image(painter = painterResource(id = R.drawable.openclaw_logo), contentDescription = "OpenClaw logo", modifier = Modifier.fillMaxSize())
    }
  }
}

@Composable
private fun WelcomeHorizon() {
  Canvas(modifier = Modifier.fillMaxWidth().height(120.dp)) {
    val arcWidth = size.width * 1.24f
    val arcHeight = size.height * 1.18f
    val left = (size.width - arcWidth) / 2f
    val top = size.height * 0.28f
    drawArc(
      color = Color.White.copy(alpha = 0.7f),
      startAngle = 202f,
      sweepAngle = 136f,
      useCenter = false,
      topLeft =
        androidx.compose.ui.geometry
          .Offset(left, top),
      size =
        androidx.compose.ui.geometry
          .Size(arcWidth, arcHeight),
      style = Stroke(width = 2.2f),
    )
    drawArc(
      color = Color.White.copy(alpha = 0.16f),
      startAngle = 200f,
      sweepAngle = 140f,
      useCenter = false,
      topLeft =
        androidx.compose.ui.geometry
          .Offset(left, top + 8f),
      size =
        androidx.compose.ui.geometry
          .Size(arcWidth, arcHeight),
      style = Stroke(width = 10f),
    )
  }
}

@Composable
private fun GatewaySetupScreen(
  setupCode: String,
  manualHost: String,
  manualPort: String,
  manualTls: Boolean,
  token: String,
  password: String,
  nearbyGatewayName: String?,
  discoveryStatusText: String,
  discoveryStarted: Boolean,
  error: String?,
  onBack: () -> Unit,
  onScan: () -> Unit,
  onSetupCodeChange: (String) -> Unit,
  onManualHostChange: (String) -> Unit,
  onManualPortChange: (String) -> Unit,
  onManualTlsChange: (Boolean) -> Unit,
  onTokenChange: (String) -> Unit,
  onPasswordChange: (String) -> Unit,
<<<<<<< HEAD
) {
  val resolvedEndpoint = remember(setupCode) { decodeGatewaySetupCode(setupCode)?.url?.let { parseGatewayEndpoint(it)?.displayUrl } }
  val manualResolvedEndpoint = remember(manualHost, manualPort, manualTls) { composeGatewayManualUrl(manualHost, manualPort, manualTls)?.let { parseGatewayEndpoint(it)?.displayUrl } }

  StepShell(title = "Gateway Connection") {
    Text(
      "Run `openclaw qr` on your gateway host, then scan the code with this device. For Tailscale or public hosts, use wss:// or Tailscale Serve.",
      style = onboardingCalloutStyle,
      color = onboardingTextSecondary,
    )
    CommandBlock("openclaw qr")
    Button(
      onClick = onScanQrClick,
      modifier = Modifier.fillMaxWidth().height(48.dp),
      shape = RoundedCornerShape(12.dp),
      colors = onboardingPrimaryButtonColors(),
    ) {
      Text("Scan QR code", style = onboardingHeadlineStyle.copy(fontWeight = FontWeight.Bold))
    }
    if (!resolvedEndpoint.isNullOrBlank()) {
      Text("QR captured. Review endpoint below.", style = onboardingCalloutStyle, color = onboardingSuccess)
      ResolvedEndpoint(endpoint = resolvedEndpoint)
    }

    Surface(
      modifier = Modifier.fillMaxWidth(),
      shape = RoundedCornerShape(12.dp),
      color = onboardingSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, onboardingBorderStrong),
      onClick = { onAdvancedOpenChange(!advancedOpen) },
    ) {
      Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
      ) {
        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
          Text("Advanced setup", style = onboardingHeadlineStyle, color = onboardingText)
          Text("Paste setup code or enter host/port manually. Private LAN ws:// is supported; Tailscale/public hosts need wss://.", style = onboardingCaption1Style, color = onboardingTextSecondary)
        }
        Icon(
          imageVector = if (advancedOpen) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
          contentDescription = if (advancedOpen) "Collapse advanced setup" else "Expand advanced setup",
          tint = onboardingTextSecondary,
        )
      }
    }

    AnimatedVisibility(visible = advancedOpen) {
      Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        GatewayModeToggle(inputMode = inputMode, onInputModeChange = onInputModeChange)

        if (inputMode == GatewayInputMode.SetupCode) {
          Text("SETUP CODE", style = onboardingCaption1Style.copy(letterSpacing = 0.9.sp), color = onboardingTextSecondary)
          OutlinedTextField(
            value = setupCode,
            onValueChange = onSetupCodeChange,
            placeholder = { Text("Paste code from `openclaw qr --setup-code-only`", color = onboardingTextTertiary, style = onboardingBodyStyle) },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
            maxLines = 5,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii),
            textStyle = onboardingBodyStyle.copy(fontFamily = FontFamily.Monospace, color = onboardingText),
            shape = RoundedCornerShape(14.dp),
            colors =
              onboardingTextFieldColors(),
          )
          if (!resolvedEndpoint.isNullOrBlank()) {
            ResolvedEndpoint(endpoint = resolvedEndpoint)
          }
        } else {
          Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            QuickFillChip(label = "Android Emulator", onClick = {
              onManualHostChange("10.0.2.2")
              onManualPortChange("18789")
              onManualTlsChange(false)
            })
            QuickFillChip(label = "Localhost", onClick = {
              onManualHostChange("127.0.0.1")
              onManualPortChange("18789")
              onManualTlsChange(false)
            })
          }

          Text("HOST", style = onboardingCaption1Style.copy(letterSpacing = 0.9.sp), color = onboardingTextSecondary)
          OutlinedTextField(
            value = manualHost,
            onValueChange = onManualHostChange,
            placeholder = { Text("10.0.2.2", color = onboardingTextTertiary, style = onboardingBodyStyle) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
            textStyle = onboardingBodyStyle.copy(color = onboardingText),
            shape = RoundedCornerShape(14.dp),
            colors =
              onboardingTextFieldColors(),
          )

          Text("PORT", style = onboardingCaption1Style.copy(letterSpacing = 0.9.sp), color = onboardingTextSecondary)
          OutlinedTextField(
            value = manualPort,
            onValueChange = onManualPortChange,
            placeholder = { Text("18789", color = onboardingTextTertiary, style = onboardingBodyStyle) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            textStyle = onboardingBodyStyle.copy(fontFamily = FontFamily.Monospace, color = onboardingText),
            shape = RoundedCornerShape(14.dp),
            colors =
              onboardingTextFieldColors(),
          )

          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
          ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
              Text("Use TLS", style = onboardingHeadlineStyle, color = onboardingText)
              Text(
                "Turn this on for Tailscale or public hosts. Private LAN ws:// remains supported.",
                style = onboardingCalloutStyle.copy(lineHeight = 18.sp),
                color = onboardingTextSecondary,
              )
            }
            Switch(
              checked = manualTls,
              onCheckedChange = onManualTlsChange,
              colors =
                onboardingSwitchColors(),
            )
          }

          Text("TOKEN (OPTIONAL)", style = onboardingCaption1Style.copy(letterSpacing = 0.9.sp), color = onboardingTextSecondary)
          OutlinedTextField(
            value = gatewayToken,
            onValueChange = onTokenChange,
            placeholder = { Text("token", color = onboardingTextTertiary, style = onboardingBodyStyle) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii),
            textStyle = onboardingBodyStyle.copy(color = onboardingText),
            shape = RoundedCornerShape(14.dp),
            colors =
              onboardingTextFieldColors(),
          )

          Text("PASSWORD (OPTIONAL)", style = onboardingCaption1Style.copy(letterSpacing = 0.9.sp), color = onboardingTextSecondary)
          OutlinedTextField(
            value = gatewayPassword,
            onValueChange = onPasswordChange,
            placeholder = { Text("password", color = onboardingTextTertiary, style = onboardingBodyStyle) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii),
            textStyle = onboardingBodyStyle.copy(color = onboardingText),
            shape = RoundedCornerShape(14.dp),
            colors =
              onboardingTextFieldColors(),
          )

          if (!manualResolvedEndpoint.isNullOrBlank()) {
            ResolvedEndpoint(endpoint = manualResolvedEndpoint)
          }
        }
      }
    }

    if (!gatewayError.isNullOrBlank()) {
      Text(gatewayError, color = onboardingWarning, style = onboardingCaption1Style)
    }
  }
}

@Composable
private fun GuideBlock(
  title: String,
  content: @Composable ColumnScope.() -> Unit,
) {
  Row(modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
    Box(modifier = Modifier.width(2.dp).fillMaxHeight().background(onboardingAccent.copy(alpha = 0.4f)))
    Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Text(title, style = onboardingHeadlineStyle, color = onboardingText)
      content()
    }
  }
}

@Composable
private fun GatewayModeToggle(
  inputMode: GatewayInputMode,
  onInputModeChange: (GatewayInputMode) -> Unit,
) {
  Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
    GatewayModeChip(
      label = "Setup Code",
      active = inputMode == GatewayInputMode.SetupCode,
      onClick = { onInputModeChange(GatewayInputMode.SetupCode) },
      modifier = Modifier.weight(1f),
    )
    GatewayModeChip(
      label = "Manual",
      active = inputMode == GatewayInputMode.Manual,
      onClick = { onInputModeChange(GatewayInputMode.Manual) },
      modifier = Modifier.weight(1f),
    )
  }
}

@Composable
private fun GatewayModeChip(
  label: String,
  active: Boolean,
  onClick: () -> Unit,
=======
  onUseNearby: () -> Unit,
  onPair: () -> Unit,
>>>>>>> upstream/main
  modifier: Modifier = Modifier,
) {
  var advancedOpen by rememberSaveable { mutableStateOf(false) }
  var nearbySearchTimedOut by remember { mutableStateOf(false) }

  LaunchedEffect(nearbyGatewayName, discoveryStatusText, discoveryStarted) {
    if (!nearbyGatewayName.isNullOrBlank()) {
      nearbySearchTimedOut = false
      return@LaunchedEffect
    }
    if (!discoveryStarted) {
      nearbySearchTimedOut = false
      return@LaunchedEffect
    }
<<<<<<< HEAD
  val notificationListenerGranted = isNotificationListenerEnabled(context)

  StepShell(title = "Permissions") {
    Text(
      "Enable only what you need. You can change these anytime in Settings.",
      style = onboardingCalloutStyle,
      color = onboardingTextSecondary,
    )

    PermissionSectionHeader("System")
    PermissionToggleRow(
      title = "Gateway discovery",
      subtitle = "Find gateways on your local network",
      checked = enableDiscovery,
      granted = isPermissionGranted(context, discoveryPermission),
      onCheckedChange = onDiscoveryChange,
    )
    InlineDivider()
    PermissionToggleRow(
      title = "Location",
      subtitle = "Share device location while app is open",
      checked = enableLocation,
      granted = locationGranted,
      onCheckedChange = onLocationChange,
    )
    InlineDivider()
    if (Build.VERSION.SDK_INT >= 33) {
      PermissionToggleRow(
        title = "Notifications",
        subtitle = "Alerts and foreground service notices",
        checked = enableNotifications,
        granted = isPermissionGranted(context, Manifest.permission.POST_NOTIFICATIONS),
        onCheckedChange = onNotificationsChange,
      )
      InlineDivider()
    }
    PermissionToggleRow(
      title = "Notification listener",
      subtitle = "Read and act on your notifications",
      checked = enableNotificationListener,
      granted = notificationListenerGranted,
      onCheckedChange = onNotificationListenerChange,
    )

    PermissionSectionHeader("Media")
    PermissionToggleRow(
      title = "Microphone",
      subtitle = "Voice transcription in the Voice tab",
      checked = enableMicrophone,
      granted = isPermissionGranted(context, Manifest.permission.RECORD_AUDIO),
      onCheckedChange = onMicrophoneChange,
    )
    InlineDivider()
    PermissionToggleRow(
      title = "Camera",
      subtitle = "Take photos and short video clips",
      checked = enableCamera,
      granted = isPermissionGranted(context, Manifest.permission.CAMERA),
      onCheckedChange = onCameraChange,
    )
    InlineDivider()
    PermissionToggleRow(
      title = "Photos",
      subtitle = "Access your recent photos",
      checked = enablePhotos,
      granted = isPermissionGranted(context, photosPermission),
      onCheckedChange = onPhotosChange,
    )

    PermissionSectionHeader("Personal Data")
    PermissionToggleRow(
      title = "Contacts",
      subtitle = "Search and add contacts",
      checked = enableContacts,
      granted = contactsGranted,
      onCheckedChange = onContactsChange,
    )
    InlineDivider()
    PermissionToggleRow(
      title = "Calendar",
      subtitle = "Read and create calendar events",
      checked = enableCalendar,
      granted = calendarGranted,
      onCheckedChange = onCalendarChange,
    )
    InlineDivider()
    PermissionToggleRow(
      title = "Motion",
      subtitle = "Activity and step tracking",
      checked = enableMotion,
      granted = motionGranted,
      onCheckedChange = onMotionChange,
      enabled = motionAvailable,
      statusOverride = if (!motionAvailable) "Unavailable on this device" else null,
    )
    if (smsAvailable) {
      InlineDivider()
      PermissionToggleRow(
        title = "SMS",
        subtitle = "Send and search text messages via the gateway",
        checked = enableSms,
        granted =
          isPermissionGranted(context, Manifest.permission.SEND_SMS) ||
            isPermissionGranted(context, Manifest.permission.READ_SMS),
        onCheckedChange = onSmsChange,
      )
    }
    if (callLogAvailable) {
      InlineDivider()
      PermissionToggleRow(
        title = "Call Log",
        subtitle = "callLog.search",
        checked = enableCallLog,
        granted = isPermissionGranted(context, Manifest.permission.READ_CALL_LOG),
        onCheckedChange = onCallLogChange,
      )
    }
    Text("All settings can be changed later in Settings.", style = onboardingCalloutStyle, color = onboardingTextSecondary)
=======
    nearbySearchTimedOut = false
    delay(5_000)
    nearbySearchTimedOut = true
>>>>>>> upstream/main
  }

  val nearbyGateway =
    nearbyGatewayUiState(
      nearbyGatewayName = nearbyGatewayName,
      discoveryStatusText = discoveryStatusText,
      discoveryStarted = discoveryStarted,
      searchTimedOut = nearbySearchTimedOut,
    )

  ClawScaffold(modifier = modifier, contentPadding = PaddingValues(horizontal = 18.dp, vertical = 16.dp)) {
    Column(modifier = Modifier.fillMaxSize().imePadding(), verticalArrangement = Arrangement.SpaceBetween) {
      LazyColumn(verticalArrangement = Arrangement.spacedBy(9.dp)) {
        item {
          OnboardingHeader(title = "Gateway Setup", subtitle = "Connect to your Gateway", onBack = onBack)
        }
        item {
          GatewayOption(
            icon = Icons.Default.QrCode2,
            title = "Scan setup code",
            subtitle = "Use your Gateway QR or setup code",
            onClick = onScan,
          )
        }
        item {
          GatewayOption(
            icon = Icons.Default.WifiTethering,
            title = "Nearby gateway",
            subtitle = nearbyGateway.subtitle,
            status = nearbyGateway.status,
            onClick = onUseNearby.takeIf { nearbyGateway.canConnect },
          )
        }
        item {
          GatewayOption(
            icon = Icons.Default.Link,
            title = "Enter gateway URL",
            subtitle = "Connect using a manual URL",
            onClick = { advancedOpen = true },
          )
        }
        error?.let { message ->
          item {
            ClawErrorState(
              title = "Setup code issue",
              body = message,
            )
          }
        }
        item {
          Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Surface(
              onClick = { advancedOpen = !advancedOpen },
              color = Color.Transparent,
              contentColor = ClawTheme.colors.text,
            ) {
              Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
              ) {
                Text(text = "Advanced", style = ClawTheme.type.section, color = ClawTheme.colors.text)
                Icon(
                  imageVector = if (advancedOpen) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                  contentDescription = null,
                  modifier = Modifier.size(25.dp),
                )
              }
            }
            if (advancedOpen) {
              ClawTextField(value = setupCode, onValueChange = onSetupCodeChange, placeholder = "Setup code")
              Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ClawTextField(value = manualHost, onValueChange = onManualHostChange, placeholder = "Host", modifier = Modifier.weight(1f))
                ClawTextField(value = manualPort, onValueChange = onManualPortChange, placeholder = "Port", modifier = Modifier.width(104.dp))
              }
              Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                TogglePill(text = if (manualTls) "TLS on" else "TLS off", selected = manualTls, onClick = { onManualTlsChange(!manualTls) })
                TogglePill(text = "Local", selected = !manualTls, onClick = { onManualTlsChange(false) })
              }
              ClawTextField(value = token, onValueChange = onTokenChange, placeholder = "Token optional")
              ClawTextField(value = password, onValueChange = onPasswordChange, placeholder = "Password optional")
            }
          }
        }
      }
      ClawPrimaryButton(text = "Pair with Gateway", icon = Icons.Default.Security, onClick = onPair, modifier = Modifier.fillMaxWidth())
    }
  }
}

@Composable
private fun GatewayRecoveryScreen(
  statusText: String,
  serverName: String?,
  attemptedGatewayName: String?,
  remoteAddress: String?,
  ready: Boolean,
  gatewayConnectionProblem: GatewayConnectionProblem?,
  connectSettling: Boolean,
  onBack: () -> Unit,
  onRetry: () -> Unit,
  onEdit: () -> Unit,
  onContinue: () -> Unit,
  modifier: Modifier = Modifier,
) {
  val recoveryState = gatewayRecoveryUiState(ready = ready, statusText = statusText, connectSettling = connectSettling, gatewayConnectionProblem = gatewayConnectionProblem)
  val context = LocalContext.current

  ClawScaffold(modifier = modifier, contentPadding = PaddingValues(horizontal = 18.dp, vertical = 16.dp)) {
    Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(18.dp)) {
      OnboardingHeader(title = "Gateway Recovery", onBack = onBack)
      Spacer(modifier = Modifier.height(12.dp))
      Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Icon(
          imageVector =
            when (recoveryState) {
              GatewayRecoveryUiState.Connected -> Icons.Default.CheckCircle
              GatewayRecoveryUiState.ApprovalRequired -> Icons.Default.WifiTethering
              GatewayRecoveryUiState.Pairing -> Icons.Default.WifiTethering
              GatewayRecoveryUiState.Finishing -> Icons.Default.WifiTethering
              GatewayRecoveryUiState.Failed -> Icons.Default.ErrorOutline
            },
          contentDescription = null,
          modifier = Modifier.size(64.dp),
          tint =
            when (recoveryState) {
              GatewayRecoveryUiState.Connected -> ClawTheme.colors.success
              GatewayRecoveryUiState.ApprovalRequired -> ClawTheme.colors.warning
              GatewayRecoveryUiState.Pairing -> ClawTheme.colors.text
              GatewayRecoveryUiState.Finishing -> ClawTheme.colors.text
              GatewayRecoveryUiState.Failed -> ClawTheme.colors.warning
            },
        )
        Text(text = recoveryState.title, style = ClawTheme.type.display, color = ClawTheme.colors.text)
        Text(
          text = recoveryState.message,
          style = ClawTheme.type.body,
          color = ClawTheme.colors.textMuted,
          textAlign = TextAlign.Center,
        )
      }

      ClawPanel {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          Text(text = "Last gateway", style = ClawTheme.type.caption, color = ClawTheme.colors.textMuted)
          Text(text = recoveryGatewayName(serverName = serverName, attemptedGatewayName = attemptedGatewayName), style = ClawTheme.type.section, color = ClawTheme.colors.text)
          Text(text = recoveryGatewayDetail(ready = ready, remoteAddress = remoteAddress, statusText = statusText, gatewayConnectionProblem = gatewayConnectionProblem), style = ClawTheme.type.body, color = ClawTheme.colors.textMuted)
          recoveryGatewayApprovalCommand(gatewayConnectionProblem)?.let { command ->
            ApprovalCommandBlock(command = command, onCopy = { copyApprovalCommand(context, command) })
          }
          ClawStatusPill(
            text =
              when (recoveryState) {
                GatewayRecoveryUiState.Connected -> "Healthy"
                GatewayRecoveryUiState.ApprovalRequired -> "Needs approval"
                GatewayRecoveryUiState.Pairing -> "Pairing"
                GatewayRecoveryUiState.Finishing -> "Connecting"
                GatewayRecoveryUiState.Failed -> "Needs attention"
              },
            status =
              when (recoveryState) {
                GatewayRecoveryUiState.Connected -> ClawStatus.Success
                GatewayRecoveryUiState.ApprovalRequired -> ClawStatus.Warning
                GatewayRecoveryUiState.Pairing -> ClawStatus.Neutral
                GatewayRecoveryUiState.Finishing -> ClawStatus.Neutral
                GatewayRecoveryUiState.Failed -> ClawStatus.Warning
              },
          )
        }
      }
<<<<<<< HEAD
    } else if (isConnected) {
      Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        color = onboardingSuccessSoft,
        border = androidx.compose.foundation.BorderStroke(1.dp, onboardingSuccess.copy(alpha = 0.2f)),
      ) {
        Row(
          modifier = Modifier.padding(14.dp),
          horizontalArrangement = Arrangement.spacedBy(12.dp),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Box(
            modifier =
              Modifier
                .size(42.dp)
                .background(onboardingSuccess.copy(alpha = 0.1f), RoundedCornerShape(11.dp)),
            contentAlignment = Alignment.Center,
          ) {
            Icon(
              imageVector = Icons.Default.CheckCircle,
              contentDescription = null,
              tint = onboardingSuccess,
              modifier = Modifier.size(22.dp),
            )
          }
          Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text("Connected", style = onboardingHeadlineStyle, color = onboardingSuccess)
            Text(
              serverName ?: remoteAddress ?: "gateway",
              style = onboardingCalloutStyle,
              color = onboardingSuccess.copy(alpha = 0.8f),
            )
          }
        }
      }
    } else {
      Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        color = onboardingWarningSoft,
        border = BorderStroke(1.dp, onboardingWarning.copy(alpha = 0.2f)),
      ) {
        Column(
          modifier = Modifier.padding(14.dp),
          verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
          Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Box(
              modifier =
                Modifier
                  .size(42.dp)
                  .background(onboardingWarning.copy(alpha = 0.1f), RoundedCornerShape(11.dp)),
              contentAlignment = Alignment.Center,
            ) {
              Icon(
                imageVector = Icons.Default.Link,
                contentDescription = null,
                tint = onboardingWarning,
                modifier = Modifier.size(22.dp),
              )
            }
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
              Text(
                  if (pairingRequired) "Pairing Required" else "Connection Failed",
                  style = onboardingHeadlineStyle,
                  color = onboardingWarning,
              )
              Text(
                  if (pairingRequired) {
                    "Approve this phone on the gateway host, or copy the report below."
                  } else {
                    "Copy this report and give it to your Claw."
                  },
                  style = onboardingCalloutStyle,
                  color = onboardingTextSecondary,
              )
            }
          }
          Text("Status", style = onboardingCaption1Style.copy(fontWeight = FontWeight.Bold), color = onboardingTextSecondary)
          Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = onboardingCommandBg,
            border = BorderStroke(1.dp, onboardingCommandBorder),
          ) {
            Text(
              statusLabel,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
              style = onboardingCalloutStyle.copy(fontFamily = FontFamily.Monospace),
              color = onboardingCommandText,
            )
          }
          if (showDiagnostics) {
            Text("Error", style = onboardingCaption1Style.copy(fontWeight = FontWeight.Bold), color = onboardingTextSecondary)
            Text(
              "OpenClaw Android ${openClawAndroidVersionLabel()}",
              style = onboardingCaption1Style,
              color = onboardingTextSecondary,
            )
            Button(
              onClick = {
                copyGatewayDiagnosticsReport(
                  context = context,
                  screen = "onboarding final check",
                  gatewayAddress = gatewayAddress,
                  statusText = statusLabel,
                )
              },
              modifier = Modifier.fillMaxWidth().height(48.dp),
              shape = RoundedCornerShape(12.dp),
              colors = ButtonDefaults.buttonColors(containerColor = onboardingSurface, contentColor = onboardingWarning),
              border = BorderStroke(1.dp, onboardingWarning.copy(alpha = 0.3f)),
            ) {
              Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(18.dp))
              Spacer(modifier = Modifier.width(8.dp))
              Text("Copy Report for Claw", style = onboardingCalloutStyle.copy(fontWeight = FontWeight.Bold))
            }
          }
          if (pairingRequired) {
            CommandBlock("openclaw devices list")
            CommandBlock("openclaw devices approve <requestId>")
            Text("Then tap Connect again.", style = onboardingCalloutStyle, color = onboardingTextSecondary)
          }
        }
=======

      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        ClawPrimaryButton(
          text = if (ready) "Continue" else "Retry connection",
          icon = if (ready) Icons.Default.CheckCircle else Icons.Default.Refresh,
          onClick = if (ready) onContinue else onRetry,
          modifier = Modifier.fillMaxWidth(),
        )
        OutlinedAction(title = "Edit connection", icon = Icons.Default.Edit, onClick = onEdit)
        OutlinedAction(title = "Copy diagnostic", icon = Icons.Default.ContentCopy, onClick = { copyGatewayDiagnostic(context, statusText, serverName, remoteAddress, ready, gatewayConnectionProblem) })
>>>>>>> upstream/main
      }
    }
  }
}

@Composable
private fun ApprovalCommandBlock(
  command: String,
  onCopy: () -> Unit,
) {
  Surface(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(8.dp),
    color = ClawTheme.colors.surfacePressed,
    border = BorderStroke(1.dp, ClawTheme.colors.border),
  ) {
    Row(
      modifier = Modifier.fillMaxWidth().padding(start = 12.dp, end = 6.dp, top = 8.dp, bottom = 8.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
      SelectionContainer(modifier = Modifier.weight(1f)) {
        Text(text = command, style = ClawTheme.type.body.copy(fontFamily = FontFamily.Monospace), color = ClawTheme.colors.text)
      }
      Surface(
        onClick = onCopy,
        modifier = Modifier.size(36.dp),
        shape = RoundedCornerShape(8.dp),
        color = ClawTheme.colors.surfaceRaised,
        contentColor = ClawTheme.colors.text,
        border = BorderStroke(1.dp, ClawTheme.colors.border),
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(imageVector = Icons.Default.ContentCopy, contentDescription = "Copy approval command", modifier = Modifier.size(18.dp))
        }
      }
    }
  }
}

@Composable
private fun PermissionSetupScreen(
  permissionState: PermissionState,
  onBack: () -> Unit,
  onContinue: () -> Unit,
  modifier: Modifier = Modifier,
) {
  ClawScaffold(modifier = modifier, contentPadding = PaddingValues(horizontal = 18.dp, vertical = 16.dp)) {
    Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
      LazyColumn(
        modifier = Modifier.weight(1f),
        contentPadding = PaddingValues(bottom = 14.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp),
      ) {
        item {
          PermissionTopBar(onBack = onBack)
        }
        item {
          Column(modifier = Modifier.padding(top = 10.dp, bottom = 18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(
              text = "Allow permissions",
              style = ClawTheme.type.title.copy(fontSize = 20.sp, lineHeight = 25.sp, fontWeight = FontWeight.Bold),
              color = ClawTheme.colors.text,
            )
            Text(
              text = "These permissions keep OpenClaw secure\nand useful.",
              style = ClawTheme.type.body,
              color = ClawTheme.colors.textMuted,
            )
          }
        }
        items(permissionState.rows, key = { it.title }) { row ->
          PermissionRow(row = row)
        }
      }
      PermissionContinueButton(onClick = onContinue)
    }
  }
}

@Composable
private fun HeroPrimaryAction(
  title: String,
  onClick: () -> Unit,
) {
  Surface(
    onClick = onClick,
    modifier = Modifier.fillMaxWidth().height(46.dp),
    shape = RoundedCornerShape(23.dp),
    color = ClawTheme.colors.primary,
    contentColor = ClawTheme.colors.primaryText,
  ) {
    Row(
      modifier = Modifier.padding(horizontal = 22.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      Icon(imageVector = Icons.Default.Security, contentDescription = null, modifier = Modifier.size(18.dp))
      Text(text = title, style = ClawTheme.type.title.copy(fontSize = 14.5.sp, lineHeight = 18.sp), modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
      Icon(imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null, modifier = Modifier.size(21.dp))
    }
  }
}

@Composable
private fun OnboardingHeader(
  title: String,
  modifier: Modifier = Modifier,
  subtitle: String? = null,
  onBack: (() -> Unit)? = null,
) {
  Row(modifier = modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
    onBack?.let {
      Surface(onClick = it, modifier = Modifier.size(34.dp), color = Color.Transparent, contentColor = ClawTheme.colors.text) {
        Box(contentAlignment = Alignment.Center) {
          Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", modifier = Modifier.size(23.dp))
        }
      }
    }
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
      Text(text = title, style = ClawTheme.type.display, color = ClawTheme.colors.text)
      subtitle?.let { Text(text = it, style = ClawTheme.type.body, color = ClawTheme.colors.textMuted) }
    }
  }
}

@Composable
private fun GatewayOption(
  icon: ImageVector,
  title: String,
  subtitle: String,
  onClick: (() -> Unit)?,
  status: String? = null,
) {
  ClawPanel(contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)) {
    ClawListItem(
      title = title,
      subtitle = subtitle,
      metadata = status,
      leading = { Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(22.dp), tint = ClawTheme.colors.text) },
      trailing =
        onClick?.let {
          {
            Icon(imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Open $title", modifier = Modifier.size(20.dp), tint = ClawTheme.colors.text)
          }
        },
      onClick = onClick,
    )
  }
}

@Composable
private fun OutlinedAction(
  title: String,
  icon: ImageVector,
  onClick: () -> Unit,
) {
  Surface(
    onClick = onClick,
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(ClawTheme.radii.control),
    color = Color.Transparent,
    contentColor = ClawTheme.colors.text,
    border = BorderStroke(1.dp, ClawTheme.colors.borderStrong),
  ) {
    Row(
      modifier = Modifier.padding(horizontal = 15.dp, vertical = 12.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
      Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(20.dp))
      Text(text = title, style = ClawTheme.type.section, modifier = Modifier.weight(1f))
    }
  }
}

@Composable
private fun TogglePill(
  text: String,
  selected: Boolean,
  onClick: () -> Unit,
) {
  Surface(
    onClick = onClick,
    shape = RoundedCornerShape(ClawTheme.radii.pill),
    color = if (selected) ClawTheme.colors.primary else ClawTheme.colors.surfaceRaised,
    contentColor = if (selected) ClawTheme.colors.primaryText else ClawTheme.colors.textMuted,
    border = BorderStroke(1.dp, if (selected) ClawTheme.colors.primary else ClawTheme.colors.border),
  ) {
    Text(text = text, modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp), style = ClawTheme.type.label)
  }
}

@Composable
private fun PermissionTopBar(onBack: () -> Unit) {
  var showHelp by remember { mutableStateOf(false) }
  if (showHelp) {
    AlertDialog(
      onDismissRequest = { showHelp = false },
      containerColor = ClawTheme.colors.surfaceRaised,
      title = { Text("Permissions", style = ClawTheme.type.section, color = ClawTheme.colors.text) },
      text = {
        Text(
          "Choose what this phone can share with OpenClaw. You can change these later in Settings.",
          style = ClawTheme.type.body,
          color = ClawTheme.colors.textMuted,
        )
      },
      confirmButton = {
        TextButton(onClick = { showHelp = false }) {
          Text("Done")
        }
      },
    )
  }
  Box(modifier = Modifier.fillMaxWidth().height(38.dp), contentAlignment = Alignment.Center) {
    Surface(
      onClick = onBack,
      modifier = Modifier.align(Alignment.CenterStart).size(34.dp),
      color = Color.Transparent,
      contentColor = ClawTheme.colors.text,
    ) {
      Box(contentAlignment = Alignment.Center) {
        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", modifier = Modifier.size(22.dp))
      }
    }
    Text(
      text = "Permission Setup",
      style = ClawTheme.type.title.copy(fontSize = 15.2.sp, lineHeight = 19.sp),
      color = ClawTheme.colors.text,
      maxLines = 1,
    )
    Surface(
      onClick = { showHelp = true },
      modifier = Modifier.align(Alignment.CenterEnd).size(28.dp),
      shape = CircleShape,
      color = Color.Transparent,
      contentColor = ClawTheme.colors.text,
      border = BorderStroke(1.dp, ClawTheme.colors.text),
    ) {
      Box(contentAlignment = Alignment.Center) {
        Text(text = "?", style = ClawTheme.type.label.copy(fontSize = 13.sp, lineHeight = 16.sp), color = ClawTheme.colors.text)
      }
    }
  }
}

@Composable
private fun PermissionRow(row: PermissionRowModel) {
  Surface(
    onClick = row.onClick,
    modifier = Modifier.fillMaxWidth().heightIn(min = 44.dp),
    shape = RoundedCornerShape(ClawTheme.radii.control),
    color = ClawTheme.colors.surfaceRaised,
    contentColor = ClawTheme.colors.text,
    border = BorderStroke(1.dp, ClawTheme.colors.borderStrong),
  ) {
    Row(
      modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 7.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
      Surface(modifier = Modifier.size(30.dp), shape = CircleShape, color = ClawTheme.colors.surfacePressed, border = BorderStroke(1.dp, ClawTheme.colors.border)) {
        Box(contentAlignment = Alignment.Center) {
          Icon(imageVector = row.icon, contentDescription = null, modifier = Modifier.size(17.dp), tint = ClawTheme.colors.text)
        }
      }
      Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(
          text = row.title,
          style = ClawTheme.type.title.copy(fontSize = 18.sp, lineHeight = 23.sp),
          color = ClawTheme.colors.text,
          maxLines = 1,
        )
        Text(
          text = row.subtitle,
          style = ClawTheme.type.body,
          color = ClawTheme.colors.textMuted,
          maxLines = 1,
        )
      }
      Text(
        text = if (row.granted) "Granted" else "Not granted",
        style = ClawTheme.type.body,
        color = if (row.granted) ClawTheme.colors.success else ClawTheme.colors.textMuted,
        maxLines = 1,
      )
      Icon(
        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
        contentDescription = null,
        modifier = Modifier.size(17.dp),
        tint = ClawTheme.colors.text,
      )
    }
  }
}

@Composable
private fun PermissionContinueButton(onClick: () -> Unit) {
  Surface(
    onClick = onClick,
    modifier = Modifier.fillMaxWidth().height(44.dp),
    shape = RoundedCornerShape(22.dp),
    color = ClawTheme.colors.primary,
    contentColor = ClawTheme.colors.primaryText,
  ) {
    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
      Text(text = "Continue", style = ClawTheme.type.title.copy(fontSize = 18.sp, lineHeight = 23.sp), color = ClawTheme.colors.primaryText)
      Icon(
        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
        contentDescription = null,
        modifier = Modifier.align(Alignment.CenterEnd).padding(end = 20.dp).size(19.dp),
        tint = ClawTheme.colors.primaryText,
      )
    }
  }
}

internal enum class GatewayRecoveryUiState(
  val title: String,
  val message: String,
) {
  Connected(
    title = "Connected",
    message = "Your Gateway is ready.",
  ),
  ApprovalRequired(
    title = "Pairing Gateway",
    message = "Approve this phone on the gateway.\nThen retry the connection.",
  ),
  Pairing(
    title = "Pairing Gateway",
    message = "Approval is in progress.\nOpenClaw will reconnect automatically.",
  ),
  Finishing(
    title = "Connecting Gateway",
    message = "OpenClaw is checking gateway and node access.",
  ),
  Failed(
    title = "Connection issue",
    message = "We could not reach your Gateway.\nLet's fix this.",
  ),
}

internal data class NearbyGatewayUiState(
  val subtitle: String,
  val status: String?,
  val canConnect: Boolean,
)

/** Maps best-effort discovery into row copy and clickability for onboarding. */
internal fun nearbyGatewayUiState(
  nearbyGatewayName: String?,
  discoveryStatusText: String,
  discoveryStarted: Boolean = true,
  searchTimedOut: Boolean = false,
): NearbyGatewayUiState {
  val name = nearbyGatewayName?.trim().takeUnless { it.isNullOrEmpty() }
  if (name != null) {
    return NearbyGatewayUiState(subtitle = name, status = "Found", canConnect = true)
  }
  if (!discoveryStarted) {
    return NearbyGatewayUiState(subtitle = "Starting discovery...", status = "Starting", canConnect = false)
  }

  val status = discoveryStatusText.trim()
  val searching =
    status.isEmpty() ||
      status.equals("Searching…", ignoreCase = true) ||
      status.contains("Searching", ignoreCase = true) ||
      status.endsWith("?", ignoreCase = true)
  return if (searching) {
    if (searchTimedOut) {
      NearbyGatewayUiState(subtitle = "No gateway found", status = "Not found", canConnect = false)
    } else {
      NearbyGatewayUiState(subtitle = "Searching for gateways...", status = "Searching", canConnect = false)
    }
  } else {
    NearbyGatewayUiState(subtitle = "No gateway found", status = "Not found", canConnect = false)
  }
}

/** Derives recovery screen state from gateway/node readiness and transient status text. */
internal fun gatewayRecoveryUiState(
  ready: Boolean,
  statusText: String,
  connectSettling: Boolean,
  gatewayConnectionProblem: GatewayConnectionProblem? = null,
): GatewayRecoveryUiState =
  when {
    ready -> GatewayRecoveryUiState.Connected
    gatewayConnectionProblem?.isPairingRequired == true &&
      !gatewayConnectionProblem.canAutoRetry -> GatewayRecoveryUiState.ApprovalRequired
    gatewayConnectionProblem?.isPairingRequired == true -> GatewayRecoveryUiState.Pairing
    gatewayConnectionProblem?.pauseReconnect == true -> GatewayRecoveryUiState.Failed
    connectSettling -> GatewayRecoveryUiState.Finishing
    gatewayStatusLooksLikePairing(statusText) -> GatewayRecoveryUiState.Pairing
    gatewayStatusLooksLikePartialConnect(statusText) -> GatewayRecoveryUiState.Finishing
    else -> GatewayRecoveryUiState.Failed
  }

/** Detects gateway-approved states where the Android node is still coming online. */
internal fun gatewayStatusLooksLikePartialConnect(statusText: String): Boolean {
  val lower = gatewayStatusForDisplay(statusText).lowercase()
  return lower.contains("operator offline") || lower.contains("node offline")
}

internal fun recoveryGatewayName(
  serverName: String?,
  attemptedGatewayName: String?,
): String =
  serverName
    ?.trim()
    ?.takeIf { it.isNotEmpty() }
    ?: attemptedGatewayName
      ?.trim()
      ?.takeIf { it.isNotEmpty() }
    ?: "Home Gateway"

private data class GatewayConfig(
  val host: String,
  val port: Int,
  val tls: Boolean,
  val bootstrapToken: String,
  val token: String,
  val password: String,
)

/** Resolves setup-code or manual fields into the gateway config used for first connect. */
private fun resolveGatewayConfig(
  setupCode: String,
  manualHost: String,
  manualPort: String,
  manualTls: Boolean,
  token: String,
  password: String,
): GatewayConfig? {
  val setup = setupCode.takeIf { it.isNotBlank() }?.let(::decodeGatewaySetupCode)
  if (setup != null) {
    val endpoint = parseGatewayEndpointResult(setup.url).config ?: return null
    val bootstrapToken = setup.bootstrapToken?.trim().orEmpty()
    // Bootstrap setup codes own first-pairing auth; fall back to typed token or
    // password only for non-bootstrap setup payloads.
    return GatewayConfig(
      host = endpoint.host,
      port = endpoint.port,
      tls = endpoint.tls,
      bootstrapToken = bootstrapToken,
      token =
        setup.token
          ?.trim()
          .orEmpty()
          .ifEmpty { if (bootstrapToken.isEmpty()) token.trim() else "" },
      password =
        setup.password
          ?.trim()
          .orEmpty()
          .ifEmpty { if (bootstrapToken.isEmpty()) password.trim() else "" },
    )
  }

  val manualUrl = composeGatewayManualUrl(manualHost, manualPort, manualTls) ?: return null
  val endpoint = parseGatewayEndpointResult(manualUrl).config ?: return null
  return GatewayConfig(
    host = endpoint.host,
    port = endpoint.port,
    tls = endpoint.tls,
    bootstrapToken = "",
    token = token.trim(),
    password = password.trim(),
  )
}

/** Selects the recovery detail line from endpoint metadata and transient gateway status. */
private fun recoveryGatewayDetail(
  ready: Boolean,
  remoteAddress: String?,
  statusText: String,
  gatewayConnectionProblem: GatewayConnectionProblem?,
): String =
  remoteAddress
    ?.takeIf { it.isNotBlank() }
    ?: if (ready) {
      "Ready for chat and voice"
    } else if (gatewayConnectionProblem?.isPairingRequired == true && !gatewayConnectionProblem.canAutoRetry) {
      recoveryGatewayApprovalCommand(gatewayConnectionProblem)
        ?.let { "Gateway approval is pending. Run this on the gateway host:" }
        ?: "Gateway approval is pending. Run openclaw devices list on the gateway host, approve this phone, then retry."
    } else if (statusText.contains("operator offline", ignoreCase = true)) {
      "Gateway paired. Waiting for operator access."
    } else if (gatewayStatusLooksLikePairing(statusText)) {
      "Gateway approval is in progress. OpenClaw will retry automatically."
    } else {
      "Gateway unreachable"
    }

private fun recoveryGatewayApprovalCommand(gatewayConnectionProblem: GatewayConnectionProblem?): String? {
  if (gatewayConnectionProblem?.isPairingRequired != true || gatewayConnectionProblem.canAutoRetry) return null
  val requestId = gatewayConnectionProblem.requestId?.trim()?.takeIf { it.isNotEmpty() }
  return if (requestId != null) {
    "openclaw devices approve $requestId"
  } else {
    "openclaw devices list"
  }
}

private fun copyApprovalCommand(
  context: Context,
  command: String,
) {
  val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
  clipboard.setPrimaryClip(ClipData.newPlainText("OpenClaw pairing approval command", command))
  Toast.makeText(context, "Approval command copied", Toast.LENGTH_SHORT).show()
}

/** Copies the onboarding recovery snapshot for support without including credentials. */
private fun copyGatewayDiagnostic(
  context: Context,
  statusText: String,
  serverName: String?,
  remoteAddress: String?,
  ready: Boolean,
  gatewayConnectionProblem: GatewayConnectionProblem?,
) {
  val approvalCommand = recoveryGatewayApprovalCommand(gatewayConnectionProblem)
  val diagnostic =
    listOfNotNull(
      "OpenClaw Android gateway diagnostic",
      "Status: $statusText",
      gatewayConnectionProblem?.message?.let { "Gateway problem: $it" },
      gatewayConnectionProblem?.requestId?.let { "Pairing request: $it" },
      approvalCommand?.let { "Approval command: $it" },
      "Gateway: ${serverName?.takeIf { it.isNotBlank() } ?: "Home Gateway"}",
      "Address: ${remoteAddress?.takeIf { it.isNotBlank() } ?: "Not available"}",
      "Ready: ${if (ready) "yes" else "no"}",
    ).joinToString("\n")
  val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
  clipboard.setPrimaryClip(ClipData.newPlainText("OpenClaw gateway diagnostic", diagnostic))
  Toast.makeText(context, "Diagnostic copied", Toast.LENGTH_SHORT).show()
}

/** One permission row plus launcher callback for onboarding's final setup step. */
private data class PermissionRowModel(
  val title: String,
  val subtitle: String,
  val icon: ImageVector,
  val granted: Boolean,
  val onClick: () -> Unit,
)

/** Permission screen model plus a commit hook that persists granted feature toggles. */
private class PermissionState(
  val rows: List<PermissionRowModel>,
  val applyToViewModel: () -> Unit,
)

/** Onboarding can finish only after gateway and node channels are both ready. */
internal fun canFinishOnboarding(
  isConnected: Boolean,
  isNodeConnected: Boolean,
): Boolean = isConnected && isNodeConnected

/** Builds permission rows and applies granted feature toggles after onboarding. */
@Composable
private fun rememberPermissionState(
  context: Context,
  viewModel: MainViewModel,
): PermissionState {
  var microphoneGranted by rememberSaveable { mutableStateOf(hasPermission(context, Manifest.permission.RECORD_AUDIO)) }
  var cameraGranted by rememberSaveable { mutableStateOf(hasPermission(context, Manifest.permission.CAMERA)) }
  var locationGranted by rememberSaveable {
    mutableStateOf(hasPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) || hasPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION))
  }
  val photosPermission = if (Build.VERSION.SDK_INT >= 33) Manifest.permission.READ_MEDIA_IMAGES else Manifest.permission.READ_EXTERNAL_STORAGE
  var photosGranted by rememberSaveable { mutableStateOf(hasPermission(context, photosPermission)) }
  var contactsGranted by rememberSaveable { mutableStateOf(hasPermission(context, Manifest.permission.READ_CONTACTS)) }
  var calendarGranted by rememberSaveable { mutableStateOf(hasPermission(context, Manifest.permission.READ_CALENDAR)) }
  var notificationsGranted by rememberSaveable {
    mutableStateOf(Build.VERSION.SDK_INT < 33 || hasPermission(context, Manifest.permission.POST_NOTIFICATIONS))
  }
  var notificationListenerGranted by rememberSaveable { mutableStateOf(DeviceNotificationListenerService.isAccessEnabled(context)) }
  val photosAvailable = SensitiveFeatureConfig.photosEnabled
  val motionAvailable = remember(context) { hasMotionCapabilities(context) }
  val smsAvailable =
    remember(context) {
      SensitiveFeatureConfig.smsEnabled &&
        context.packageManager?.hasSystemFeature(PackageManager.FEATURE_TELEPHONY) == true
    }
  val callLogAvailable = SensitiveFeatureConfig.callLogEnabled
  var motionGranted by rememberSaveable { mutableStateOf(!motionAvailable || hasPermission(context, Manifest.permission.ACTIVITY_RECOGNITION)) }
  var smsGranted by rememberSaveable {
    mutableStateOf(
      !smsAvailable ||
        (
          hasPermission(context, Manifest.permission.SEND_SMS) &&
            hasPermission(context, Manifest.permission.READ_SMS)
        ),
    )
  }
  var callLogGranted by rememberSaveable { mutableStateOf(!callLogAvailable || hasPermission(context, Manifest.permission.READ_CALL_LOG)) }
  val lifecycleOwner = LocalLifecycleOwner.current

  DisposableEffect(lifecycleOwner, context) {
    val observer =
      LifecycleEventObserver { _, event ->
        if (event == Lifecycle.Event.ON_RESUME) {
          notificationListenerGranted = DeviceNotificationListenerService.isAccessEnabled(context)
        }
      }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
  }

  val permissionLauncher =
    rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
      microphoneGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: microphoneGranted
      cameraGranted = permissions[Manifest.permission.CAMERA] ?: cameraGranted
      locationGranted =
        permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
        permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true ||
        locationGranted
      photosGranted = permissions[photosPermission] ?: photosGranted
      contactsGranted = permissions[Manifest.permission.READ_CONTACTS] ?: contactsGranted
      calendarGranted = permissions[Manifest.permission.READ_CALENDAR] ?: calendarGranted
      notificationsGranted = permissions[Manifest.permission.POST_NOTIFICATIONS] ?: notificationsGranted
      motionGranted = permissions[Manifest.permission.ACTIVITY_RECOGNITION] ?: motionGranted
      smsGranted =
        (permissions[Manifest.permission.SEND_SMS] ?: smsGranted) &&
        (permissions[Manifest.permission.READ_SMS] ?: smsGranted)
      callLogGranted = permissions[Manifest.permission.READ_CALL_LOG] ?: callLogGranted
    }

  fun request(vararg permissions: String) {
    permissionLauncher.launch(permissions.filterNot { hasPermission(context, it) }.toTypedArray())
  }

  val rows =
    listOfNotNull(
      PermissionRowModel("Voice", "Record and transcribe audio", Icons.Default.Mic, microphoneGranted) {
        request(Manifest.permission.RECORD_AUDIO)
      },
      PermissionRowModel("Camera", "Capture photos and video", Icons.Default.CameraAlt, cameraGranted) {
        request(Manifest.permission.CAMERA)
      },
      PermissionRowModel("Location", "Use location when needed", Icons.Default.LocationOn, locationGranted) {
        request(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)
      },
      if (photosAvailable) {
        PermissionRowModel("Photos", "Attach photos and media", Icons.Default.Image, photosGranted) {
          request(photosPermission)
        }
      } else {
        null
      },
      PermissionRowModel("Contacts", "Read contacts securely", Icons.Default.Person, contactsGranted) {
        request(Manifest.permission.READ_CONTACTS, Manifest.permission.WRITE_CONTACTS)
      },
      PermissionRowModel("Calendar", "Read events and schedules", Icons.Default.CalendarMonth, calendarGranted) {
        request(Manifest.permission.READ_CALENDAR, Manifest.permission.WRITE_CALENDAR)
      },
      PermissionRowModel("Notifications", "Send important alerts", Icons.Default.Notifications, notificationsGranted) {
        if (Build.VERSION.SDK_INT >= 33) request(Manifest.permission.POST_NOTIFICATIONS)
      },
      PermissionRowModel("Notification listener", "Forward selected app alerts", Icons.Default.Sensors, notificationListenerGranted) {
        context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
      },
      if (motionAvailable) {
        PermissionRowModel("Motion", "Read activity and step context", Icons.Default.Sensors, motionGranted) {
          request(Manifest.permission.ACTIVITY_RECOGNITION)
        }
      } else {
        null
      },
      if (smsAvailable) {
        PermissionRowModel("SMS", "Send and read messages when approved", Icons.Default.Notifications, smsGranted) {
          request(Manifest.permission.SEND_SMS, Manifest.permission.READ_SMS)
        }
      } else {
        null
      },
      if (callLogAvailable) {
        PermissionRowModel("Call Log", "Read recent call context", Icons.Default.Person, callLogGranted) {
          request(Manifest.permission.READ_CALL_LOG)
        }
      } else {
        null
      },
    )

  return PermissionState(
    rows = rows,
    applyToViewModel = {
      viewModel.setCameraEnabled(cameraGranted)
      viewModel.setLocationMode(if (locationGranted) LocationMode.WhileUsing else LocationMode.Off)
      viewModel.setNotificationForwardingEnabled(notificationListenerGranted)
    },
  )
}

private fun hasPermission(
  context: Context,
  permission: String,
): Boolean = ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED

/** Returns true when Android exposes any motion sensor that can back node motion commands. */
private fun hasMotionCapabilities(context: Context): Boolean {
  val sensorManager = context.getSystemService(SensorManager::class.java) ?: return false
  return sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER) != null ||
    sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null ||
    sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR) != null
}
